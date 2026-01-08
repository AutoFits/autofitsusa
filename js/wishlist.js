const container = document.getElementById("wishlistItems");

const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

if (wishlist.length === 0) {
  container.innerHTML = "<p>Your wishlist is empty.</p>";
} else {
  wishlist.forEach(p => {
    const div = document.createElement("div");
    div.className = "wishlist-item";

    div.innerHTML = `
      <img src="${p.images?.[0] || p.image || 'images/placeholder.webp'}">
      <div>
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <button onclick="goToProduct('${p.id}')">View Product</button>
      </div>
    `;

    container.appendChild(div);
  });
}

function goToProduct(id) {
  window.location.href = `product.html?id=${id}`;
}

