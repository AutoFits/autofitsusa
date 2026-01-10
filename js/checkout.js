/* =========================
   SHOW TOTAL
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const totalEl = document.getElementById("total");
  if (!totalEl) return;

  const rawTotal = localStorage.getItem("cartTotal");
  const total = rawTotal
    ? Number(rawTotal.replace(/[^0-9.]/g, ""))
    : 0;

  totalEl.textContent = total > 0 ? `$${total.toFixed(2)}` : "$0.00";
});

/* =========================
   PLACE ORDER
========================= */
async function placeOrder() {
  const rawCart = localStorage.getItem("cart");
  const cart = rawCart ? JSON.parse(rawCart) : [];

  console.log("RAW CART 👉", cart);

  if (!Array.isArray(cart) || cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  // 🔥 SAFE NORMALIZATION
  const cartItems = [];

  for (const item of cart) {
    const rawPrice =
      item.price ??
      item.selling ??
      item.amount ??
      item.cost ??
      item.value;

    const price = Number(String(rawPrice).replace(/[^0-9.]/g, ""));

    if (!price || isNaN(price)) {
      console.error("❌ BAD ITEM:", item);
      alert("One item in your cart has an invalid price. Please re-add it.");
      return;
    }

    cartItems.push({
      name: item.name || item.title || item.productName || "AutoFits USA Product",
      price,
      qty: Number(item.qty || item.quantity || item.count || 1)
    });
  }

  console.log("SANITIZED ITEMS 👉", cartItems);

  try {
    const response = await fetch(
      "/.netlify/functions/create-checkout-session",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems })
      }
    );

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error(data);
      alert("Payment initialization failed.");
    }
  } catch (err) {
    console.error(err);
    alert("Checkout failed. Please try again.");
  }
}

/* =========================
   BUTTON
========================= */
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("placeOrderBtn")
    ?.addEventListener("click", placeOrder);
});
