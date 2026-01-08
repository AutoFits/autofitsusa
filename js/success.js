document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session_id");

  const orderIdEl = document.getElementById("orderId");

  if (sessionId && orderIdEl) {
    orderIdEl.textContent = sessionId;
  } else if (orderIdEl) {
    orderIdEl.textContent = "Unavailable";
  }
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
