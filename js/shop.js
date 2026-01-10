function toggleMenu() {
  document.getElementById("navLinks")?.classList.toggle("show");
}

const urlParams = new URLSearchParams(window.location.search);
const brandFromURL = urlParams.get("brand");
const searchFromURL = urlParams.get("search");

/* =========================
   NAV
========================= */
function toggleMenu() {
  document.getElementById("navLinks")?.classList.toggle("show");
}



/* =========================
   FILTER + RENDER
========================= */
function applyFilters() {
  if (typeof PRODUCTS === "undefined") {
    console.error("PRODUCTS not loaded");
    return;
  }

  const searchInput = document.getElementById("searchInput");
  const liveQuery = searchInput ? searchInput.value.toLowerCase().trim() : "";

  const results = PRODUCTS.filter(p => {
    if (brandFromURL && p.brand !== brandFromURL) return false;

    if (searchFromURL) {
      const text = `${p.name} ${p.brand} ${p.category} ${p.partNumber || ""}`.toLowerCase();
      if (!text.includes(searchFromURL.toLowerCase())) return false;
    }

    if (liveQuery) {
      const text = `${p.name} ${p.brand} ${p.category} ${p.partNumber || ""}`.toLowerCase();
      if (!text.includes(liveQuery)) return false;
    }

    return true;
  });

  renderProducts(results);
}

/* =========================
   PRODUCT CARDS
========================= */
function renderProducts(list) {
  const container = document.getElementById("products");
  container.innerHTML = "";

  if (!list || list.length === 0) {
    container.innerHTML = "<p>No products found.</p>";
    return;
  }

  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "product";
    card.onclick = () => openProduct(p.id);

    const img =
      (p.images && p.images[0]) ||
      p.image ||
      "images/placeholder.webp";

    card.innerHTML = `
      <img src="${img}" class="product-img">
      <h3>${p.name.length > 60 ? p.name.slice(0, 60) + "…" : p.name}</h3>
      <div class="price-box">
  <span class="mrp">$${p.mrp}</span>
  <span class="selling">$${p.price}</span>
</div>

      <button class="cart-btn"
        onclick="event.stopPropagation(); addItem('${p.id}')">
        Add to Cart
      </button>
    `;

    container.appendChild(card);
  });
}

/* =========================
   NAVIGATION
========================= */
function openProduct(id) {
  console.log("Opening product:", id);
  window.location.href = `product.html?id=${id}`;
}


/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  applyFilters();
  updateCartCount();
});
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let count = 0;

  cart.forEach(item => {
    count += Number(item.qty || 0);
  });

  const badge = document.getElementById("cartCount");
  if (badge) badge.textContent = count;
}

document.addEventListener("DOMContentLoaded", updateCartCount);
window.addEventListener("storage", updateCartCount);
