function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("show");
}

function goToCart() {
  window.location.href = "cart.html";
}

function goToBrand(brand) {
  window.location.href = `shop.html?brand=${brand}`;
}

function handleMainSearch(e) {
  if (e.key === "Enter") {
    const query = document.getElementById("mainSearch").value.trim();
    if (query) {
      window.location.href = `shop.html?search=${encodeURIComponent(query)}`;
    }
  }
}

function handleLiveSearch() {
  const query = document.getElementById("mainSearch").value.toLowerCase();
  const resultsBox = document.getElementById("searchResults");

  resultsBox.innerHTML = "";

  if (query.length < 2) return;

  const matches = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(query) ||
    (p.brand && p.brand.toLowerCase().includes(query)) ||
    (p.partNumber && p.partNumber.toLowerCase().includes(query))
  );

  if (matches.length === 0) {
    resultsBox.innerHTML = `<div class="search-item">No results found</div>`;
    return;
  }

  matches.slice(0, 6).forEach(p => {
    const div = document.createElement("div");
    div.className = "search-item";

    const imgSrc =
      (p.images && p.images.length && p.images[0]) ||
      p.image ||
      "images/placeholder.webp";

    div.innerHTML = `
      <img src="${imgSrc}" alt="${p.name}">
      <div class="search-text">
        <strong>${p.name}</strong>
        <span>${p.brand || ""}</span>
      </div>
    `;

    div.onclick = () => {
      window.location.href = `product.html?id=${p.id}`;
    };

    resultsBox.appendChild(div);
  });
}

