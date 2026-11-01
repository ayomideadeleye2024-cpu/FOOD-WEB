// ============================================================
// AYLALLA FOODS AND PASTRIES – Main JavaScript
// ============================================================

/* Initialise cart from localStorage or empty array */
let cart = JSON.parse(localStorage.getItem('ayalallaCart')) || [];

/* Render cart badge in header */
function renderCartBadge() {
  const badge = document.querySelector('.cart-badge');
  if (!badge) return;
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = total;
  badge.style.display = total > 0 ? 'block' : 'none';
}

/* Add product to cart */
window.cartAdd = function(productId, productName, productPrice) {
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
  }
  localStorage.setItem('ayalallaCart', JSON.stringify(cart));
  renderCartBadge();
  // subtle pop animation
  const badge = document.querySelector('.cart-badge');
  badge.style.transform = 'scale(1.2)';
  setTimeout(() => { badge.style.transform = ''; }, 250);
};

/* Remove one instance of product from cart */
window.cartRemove = function(productId) {
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
  updateCartSidebar(); // keep sidebar in sync
};

/* Update quantity directly */
window.cartUpdateQuantity = function(productId, newQty) {
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

/* Clear entire cart */
window.cartClear = function() {
  cart = [];
  localStorage.removeItem('ayalallaCart');
  renderCartBadge();
  updateCartSidebar();
};

/* Cart total calculations */
function cartTotal() {
  let subtotal = 0;
  cart.forEach(item => subtotal += item.price * item.quantity);
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;
  return { subtotal, tax, total };
}

/* Render cart sidebar on Order Online page */
function updateCartSidebar() {
  const sidebar = document.querySelector('.cart-overlay');
  if (!sidebar) return;
  const list = sidebar.querySelector('.cart-item-list');
  const summary = sidebar.querySelector('.cart-summary');
  if (!list || !summary) return;

  // clear list
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

  // update summary
  const { subtotal, tax, total } = cartTotal();
  summary.querySelector('.subtotal').textContent = `$${subtotal.toFixed(2)}`;
  summary.querySelector('.tax').textContent = `$${tax.toFixed(2)}`;
  summary.querySelector('.total-amount').textContent = `$${total.toFixed(2)}`;
}

/* Mobile menu toggle */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeBtn = mobileMenu.querySelector('.close-btn');
  const navLinks = mobileMenu.querySelectorAll('.nav-links a');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('open');
  });

  closeBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });

  // close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  });

  // close if clicking outside
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });
}

/* Smooth scrolling for anchor links */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* Scroll reveal simple effect */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));
}

/* Initialise on DOMContentLoaded */
document.addEventListener('DOMContentLoaded', () => {
  renderCartBadge();
  initMobileMenu();
  initSmoothScroll();
  initScrollReveal();
});