/* =========================
   SHOW TOTAL
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const totalEl = document.getElementById("total");
  if (!totalEl) return;

  const rawTotal = localStorage.getItem("cartTotal");
  const cleanTotal = rawTotal
    ? Number(rawTotal.replace(/[^0-9.]/g, ""))
    : 0;

  totalEl.textContent =
    cleanTotal > 0 ? `$${cleanTotal.toFixed(2)}` : "$0.00";
});

/* =========================
   PLACE ORDER
========================= */
async function placeOrder() {
  const rawCart = localStorage.getItem("cart");
  const cart = rawCart ? JSON.parse(rawCart) : [];

  if (!Array.isArray(cart) || cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const firstName = document.getElementById("firstName")?.value.trim();
  const lastName  = document.getElementById("lastName")?.value.trim();
  const email     = document.getElementById("email")?.value.trim();
  const address   = document.getElementById("address")?.value.trim();

  if (!firstName || !lastName || !email || !address) {
    alert("Please fill in all required fields.");
    return;
  }

  // ✅ SANITIZE CART ITEMS (THIS IS THE FIX)
  const cartItems = cart.map(item => {
    const rawPrice = item.price ?? item.sellingPrice ?? item.amount ?? "";

    const price = Number(
      String(rawPrice).replace(/[^0-9.]/g, "")
    );

    if (!price || isNaN(price)) {
      throw new Error(`Invalid price for item: ${item.name}`);
    }

    return {
      name: item.name || item.title || "AutoFits USA Product",
      price: price,
      qty: Number(item.qty || 1)
    };
  });

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
    alert(err.message || "Checkout failed.");
  }
}

/* =========================
   BUTTON BINDING
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("placeOrderBtn");
  if (btn) btn.addEventListener("click", placeOrder);
});
