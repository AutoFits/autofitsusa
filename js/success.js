document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ SUCCESS PAGE LOADED — CLEARING CART");

  // Clear cart completely
  localStorage.removeItem("cart");
  localStorage.removeItem("cartTotal");

  // Force navbar cart badge to zero
  const badge = document.getElementById("cartCount");
  if (badge) badge.textContent = "0";
});

/* Buttons */
function goHome() {
  window.location.href = "index.html";
}

function continueShopping() {
  window.location.href = "shop.html";
}


