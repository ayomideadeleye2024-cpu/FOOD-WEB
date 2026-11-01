// ============================================================
// AYLALLA FOODS AND PASTRIES – Order Online JavaScript
// Shopping cart sidebar, quantity controls, checkout placeholder
// ============================================================

/* Initialise cart sidebar on page load */
document.addEventListener('DOMContentLoaded', () => {
  // render cart items and totals
  updateCartSidebar();
  // toggle cart overlay
  const cartBtn = document.querySelector('.cart-btn');
  const overlay = document.querySelector('.cart-overlay');
  const closeCart = overlay?.querySelector('.close-cart');
  if (cartBtn) cartBtn.addEventListener('click', () => overlay.classList.add('open'));
  if (closeCart) closeCart.addEventListener('click', () => overlay.classList.remove('open'));
  // close overlay when clicking outside
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

/* Global functions expected by HTML onclick handlers */
window.cartAdd = function(productId, productName, productPrice) {
  // reuse main logic – we will also call main's functions if available
  // For simplicity, duplicate minimal logic:
  let cart = JSON.parse(localStorage.getItem('ayalallaCart')) || [];
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
  }
  localStorage.setItem('ayalallaCart', JSON.stringify(cart));
  renderCartBadge(); // assumes badge element exists globally
  updateCartSidebar();
};

window.cartRemove = function(productId) {
  let cart = JSON.parse(localStorage.getItem('ayalallaCart')) || [];
  const index = cart.findIndex(i => i.id === productId);
  if (index > -1) {
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
    } else {
      cart.splice(index, 1);
    }
  }
  localStorage.setItem('ayalallaCart', JSON.stringify(cart));
  renderCartBadge();
  updateCartSidebar();
};

window.cartUpdateQuantity = function(productId, newQty) {
  let cart = JSON.parse(localStorage.getItem('ayalallaCart')) || [];
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity = Math.max(0, newQty);
    if (item.quantity === 0) {
      cart = cart.filter(i => i.id !== productId);
    }
  }
  localStorage.setItem('ayalallaCart', JSON.stringify(cart));
  renderCartBadge();
  updateCartSidebar();
};

window.cartClear = function() {
  localStorage.removeItem('ayalallaCart');
  cart = []; // local var only
  renderCartBadge();
  updateCartSidebar();
};

function cartTotal() {
  let subtotal = 0;
  cart.forEach(item => subtotal += item.price * item.quantity);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

/* Render cart sidebar */
function updateCartSidebar() {
  const sidebar = document.querySelector('.cart-overlay');
  if (!sidebar) return;
  const list = sidebar.querySelector('.cart-item-list');
  const summary = sidebar.querySelector('.cart-summary');
  if (!list || !summary) return;

  list.innerHTML = '';
  if (cart.length === 0) {
    list.innerHTML = '<p style="color:#777;">Your cart is empty</p>';
    summary.style.display = 'none';
    return;
  }
  summary.style.display = 'block';
  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="assets/images/${item.id}.jpg" alt="${item.name}" loading="lazy">
      <div>
        <span>${item.name}</span>
        <div class="qty-controls">
          <button class="qty-btn minus" onclick="cartUpdateQuantity('${item.id}', ${item.quantity - 1})">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn plus" onclick="cartUpdateQuantity('${item.id}', ${item.quantity + 1})">+</button>
        </div>
      </div>
      <span class="price">$${(item.price * item.quantity).toFixed(2)}</span>
      <button class="remove" onclick="cartRemove('${item.id}')">×</button>
    `;
    list.appendChild(div);
  });

  const { subtotal, tax, total } = cartTotal();
  summary.querySelector('.subtotal').textContent = `$${subtotal.toFixed(2)}`;
  summary.querySelector('.tax').textContent = `$${tax.toFixed(2)}`;
  summary.querySelector('.total-amount').textContent = `$${total.toFixed(2)}`;
}

/* Checkout placeholder */
window.checkout = function() {
  const thankYou = document.getElementById('thank-you');
  if (thankYou) {
    thankYou.style.display = 'block';
    const overlay = document.querySelector('.cart-overlay');
    if (overlay) overlay.classList.remove('open');
  } else {
    alert('Thank you for your order! This is a static demo – no payment is processed.');
  }
};

/* Render initial badge (if page also includes header) */
function renderCartBadge() {
  const badge = document.querySelector('.cart-badge');
  if (!badge) return;
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = total;
  badge.style.display = total > 0 ? 'block' : 'none';
}