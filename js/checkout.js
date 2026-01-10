/* =========================
   SHOW TOTAL
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const totalEl = document.getElementById("total");
  const storedTotal = localStorage.getItem("cartTotal");

  if (totalEl && storedTotal) {
    totalEl.textContent = `$${Number(storedTotal).toFixed(2)}`;
  }
});

/* =========================
   PLACE ORDER
========================= */
async function placeOrder() {
  const rawCart = JSON.parse(localStorage.getItem("cart")) || [];

  console.log("RAW CART:", rawCart);

  if (!rawCart.length) {
    alert("Your cart is empty.");
    return;
  }

  // 🔥 BUILD FULL ITEMS FROM PRODUCTS
  const cartItems = rawCart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return null;

    return {
      name: product.name,
      price: product.price,
      qty: item.qty
    };
  }).filter(Boolean);

  if (!cartItems.length) {
    alert("Cart contains invalid items. Please re-add.");
    return;
  }

  // 🔥 REQUIRED BY BACKEND
  const totalAmount = cartItems.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  try {
    const res = await fetch("/.netlify/functions/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        totalAmount,
        cartItems
      })
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      console.error(data);
      alert("Payment initialization failed.");
    }
  } catch (err) {
    console.error(err);
    alert("Checkout error");
  }
}


/* =========================
   BUTTON BINDING
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("placeOrderBtn");
  if (btn) btn.addEventListener("click", placeOrder);
});
