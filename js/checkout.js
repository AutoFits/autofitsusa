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

const cartItems = [];

for (const item of rawCart) {
  const product = getProductById(item.id);

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
}
body: JSON.stringify({
  orderId,
  totalAmount: total,
  cartItems, // 👈 NOW CLEAN & VALID
  customer_name: name,
  customer_email: email,
  customer_address: address
})



/* =========================
   BUTTON
========================= */
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("placeOrderBtn")
    ?.addEventListener("click", placeOrder);
});
