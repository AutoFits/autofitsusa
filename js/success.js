document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session_id");

  const orderIdEl = document.getElementById("orderId");
  if (orderIdEl) {
    orderIdEl.textContent = sessionId || "Unavailable";
  }

  /* =========================
     🔥 CLEAR CART AFTER PAYMENT
     ========================= */

  localStorage.removeItem("cart");
  localStorage.removeItem("cartTotal");

  /* Update cart badge immediately */
  const badge = document.getElementById("cartCount");
  if (badge) badge.textContent = "0";
});

/* =========================
   BUTTON ACTIONS
   ========================= */

function goHome() {
  window.location.href = "index.html";
}

function continueShopping() {
  window.location.href = "shop.html";
}

