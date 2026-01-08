function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("show");
}
function goToCart() {
  window.location.href = "cart.html";
}
function goToShop() {
  window.location.href = "shop.html";
}

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
