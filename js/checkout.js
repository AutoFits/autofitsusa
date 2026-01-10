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

  // 🔥 HYDRATE CART USING PRODUCTS
  const cartItems = rawCart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.id);

    if (!product || typeof product.price !== "number") {
      console.error("❌ INVALID PRODUCT:", item);
      return null;
    }

    return {
      name: product.name,
      price: product.price,
      qty: item.qty
    };
  }).filter(Boolean);

  if (!cartItems.length) {
    alert("One item in your cart has an invalid price. Please re-add it.");
    return;
  }

  // 🔥 CUSTOMER INFO
  const firstName = document.getElementById("firstName")?.value.trim();
  const lastName  = document.getElementById("lastName")?.value.trim();
  const email     = document.getElementById("email")?.value.trim();
  const address   = document.getElementById("address")?.value.trim();

  if (!firstName || !lastName || !address) {
    alert("Please fill all required fields.");
    return;
  }

  const orderId = "AFU-" + Date.now();

  try {
    const res = await fetch("/.netlify/functions/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
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
    console.error("Checkout error:", err);
    alert("Something went wrong. Please try again.");
  }
}

/* =========================
   BUTTON BINDING
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("placeOrderBtn");
  if (btn) btn.addEventListener("click", placeOrder);
});
