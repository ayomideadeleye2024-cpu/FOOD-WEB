// ============================================================
// AYLALLA FOODS AND PASTRIES – Menu page JavaScript
// Category filtering & search
// ============================================================

// Product data – each product: id, name, category, price, description, image
const products = [
  { id: 'croissant', name: 'Almond Croissant', category: 'pastries', price: 4.50, desc: 'Flaky pastry filled with almond cream', img: 'croissant.jpg' },
  { id: 'pain-au-chocolat', name: 'Pain au Chocolat', category: 'pastries', price: 4.20, desc: 'Buttery chocolate-filled viennoise', img: 'pain-au-chocolat.jpg' },
  { id: 'cupcake-vanilla', name: 'Vanilla Cupcake', category: 'cakes', price: 3.80, desc: 'Vanilla sponge with buttercream frosting', img: 'cupcake-vanilla.jpg' },
  { id: 'red-velvet', name: 'Red Velvet Cake', category: 'cakes', price: 5.80, desc: 'Classic red velvet with cream cheese frosting', img: 'red-velvet.jpg' },
  { id: 'baguette', name: 'Sourdough Baguette', category: 'bread', price: 3.50, desc: 'Crusty fermented wheat bread', img: 'baguette.jpg' },
  { id: 'ciabatta', name: 'Ciabatta Loaf', category: 'bread', price: 4.00, desc: 'Italian white bread with open crumb', img: 'ciabatta.jpg' },
  { id: 'espresso', name: 'Espresso', category: 'drinks', price: 2.80, desc: 'Rich double shot of espresso', img: 'espresso.jpg' },
  { id: 'latte', name: 'Café Latte', category: 'drinks', price: 3.50, desc: 'Espresso with steamed milk', img: 'latte.jpg' },
];

/* Render product grid */
function renderProducts(filtered) {
  const grid = document.querySelector('.products-grid');
  if (!grid) return;
  grid.innerHTML = '';
  if (filtered.length === 0) {
    grid.innerHTML = '<p style="color:#777; grid-column:1/-1;">No products found matching your search.</p>';
    return;
  }
  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="assets/images/${p.img}" alt="${p.name}" loading="lazy">
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <p class="price">$${p.price.toFixed(2)}</p>
        <button class="add-to-cart" onclick="cartAdd('${p.id}', '${p.name}', ${p.price}); renderCartBadge();">Add to Cart</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* Filter by category */
window.filterByCategory = function(category) {
  if (category === 'all') {
    renderProducts(products);
  } else {
    const filtered = products.filter(p => p.category === category);
    renderProducts(filtered);
  }
};

/* Real-time search filter */
function initSearch() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;
  searchInput.addEventListener('input', function() {
    const term = this.value.trim().toLowerCase();
    if (!term) {
      renderProducts(products);
      return;
    }
    const matched = products.filter(p =>
      p.name.toLowerCase().includes(term) || p.desc.toLowerCase().includes(term)
    );
    renderProducts(matched);
  });
}

/* Initialise on DOMContentLoaded */
document.addEventListener('DOMContentLoaded', () => {
  // render initial ‘All’ products
  renderProducts(products);
  initSearch();
});