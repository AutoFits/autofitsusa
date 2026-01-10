document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session_id");

  const orderEl = document.getElementById("orderId");

  if (sessionId) {
    orderEl.textContent = sessionId;
  } else {
    orderEl.textContent = "Order confirmed";
  }

  // 🔥 Clear cart after successful payment
  localStorage.removeItem("cart");
  localStorage.removeItem("cartTotal");

  if (typeof updateCartCount === "function") {
    updateCartCount();
  }
});
function goHome() {
  window.location.href = "index.html";
}

function continueShopping() {
  window.location.href = "shop.html";
}



