/* =========================
   CART CORE (SINGLE SOURCE)
   ========================= */

/*
 CART FORMAT (ONLY THIS):
 [
   { id: "product_id", qty: 2 },
   { id: "another_id", qty: 1 }
 ]
*/

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* =========================
   ADD / REMOVE ITEMS
   ========================= */

function addItem(productId) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);

  if (item) {
    item.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }

  saveCart(cart);
  updateCartCount();
  showToast("Item added to cart");
}

function removeItem(productId) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== productId);
  saveCart(cart);
  updateCartCount();
  renderCart();
}

function changeQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    const index = cart.indexOf(item);
    cart.splice(index, 1);
  }

  saveCart(cart);
  updateCartCount();
  renderCart();
}

/* =========================
   CART COUNT (NAVBAR)
   ========================= */

function updateCartCount() {
  const cart = getCart();
  let count = 0;

  cart.forEach(i => count += i.qty);

  const badge = document.getElementById("cartCount");
  if (badge) badge.textContent = count;
}

/* =========================
   CART PAGE RENDER
   ========================= */

function renderCart() {
  const container = document.getElementById("cartItems");
  if (!container) return;

  const cart = getCart();
  container.innerHTML = "";

  if (!cart.length) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    setTotals(0, 0);
    return;
  }

  let subtotal = 0;
  let totalQty = 0;

  cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return;

    const lineTotal = product.price * item.qty;
    subtotal += lineTotal;
    totalQty += item.qty;

    container.innerHTML += `
      <div class="cart-item">
        <img src="${product.images?.[0] || product.image || 'images/placeholder.webp'}">
        <div class="cart-info">
          <h4>${product.name}</h4>
          <p>$${product.price} each</p>

          <div class="qty">
            <button onclick="changeQty('${item.id}', -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty('${item.id}', 1)">+</button>
          </div>
        </div>
        <strong>$${lineTotal.toFixed(2)}</strong>
        
      </div>
    `;
  });

  let discount = 0;
  if (totalQty >= 2) discount = subtotal * 0.05;

  setTotals(subtotal, discount);
}

/* =========================
   TOTALS
   ========================= */

function setTotals(subtotal, discount) {
  const subtotalEl = document.getElementById("subtotal");
  const discountEl = document.getElementById("discount");
  const totalEl = document.getElementById("total");
  const discountRow = document.getElementById("discountRow");

  
  const total = subtotal - discount;
  localStorage.setItem("cartTotal", total.toFixed(2));

  if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2);
  if (totalEl) totalEl.textContent = total.toFixed(2);

  if (discount > 0 && discountEl && discountRow) {
    discountRow.classList.remove("hidden");
    discountEl.textContent = discount.toFixed(2);
  } else if (discountRow) {
    discountRow.classList.add("hidden");
  }
}

/* =========================
   TOAST (GLOBAL)
   ========================= */

function showToast(message) {
  let toast = document.getElementById("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.className = "toast show";

  setTimeout(() => {
    toast.className = "toast";
  }, 2000);
}

/* =========================
   INIT
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();
});

function goBack() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = "shop.html";
  }
}
function goToCheckout() {
  const cart = getCart();

  if (!cart.length) {
    alert("Your cart is empty");
    return;
  }

  // Prevent double click issues
  window.location.assign("checkout.html");
}



