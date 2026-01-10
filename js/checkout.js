// 🔥 IMPORT PRODUCTS (make sure data.js is loaded before checkout.js)
function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}


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
  const rawCart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!rawCart.length) {
    alert("Your cart is empty.");
    return;
  }

  const firstName = document.getElementById("firstName")?.value.trim();
  const lastName  = document.getElementById("lastName")?.value.trim();
  const email     = document.getElementById("email")?.value.trim();
  const address   = document.getElementById("address")?.value.trim();

  if (!firstName || !lastName || !address) {
    alert("Please fill in all required fields.");
    return;
  }

  const name = `${firstName} ${lastName}`.trim();

  const rawTotal = localStorage.getItem("cartTotal");
  const total = rawTotal ? Number(rawTotal.replace(/[^0-9.]/g, "")) : 0;

  if (!total || total <= 0 || Number.isNaN(total)) {
    alert("Invalid order total. Please refresh cart.");
    return;
  }

  // 🔥 HYDRATE CART USING PRODUCTS
  const cartItems = [];

  for (const item of rawCart) {
    const product = PRODUCTS.find(p => p.id === item.id);

    if (!product || typeof product.price !== "number") {
      console.error("BAD ITEM:", item);
      alert("One item in your cart has an invalid price. Please re-add it.");
      return;
    }

    cartItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: item.qty
    });
  }

  // ✅ DEFINE ORDER ID (THIS WAS MISSING)
  const orderId = "AFU-" + Date.now();

  try {
    const response = await fetch("/.netlify/functions/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        totalAmount: total,
        cartItems,
        customer_name: name,
        customer_email: email,
        customer_address: address
      })
    });

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error(data);
      alert("Payment initialization failed.");
    }

  } catch (err) {
    console.error("Checkout error:", err);
    alert("Something went wrong. Please try again.");
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
