function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("show");
}
function goToCart() {
  window.location.href = "cart.html";
}

/* CHAT TOGGLE */
function toggleChat() {
  document.getElementById("chatBox").classList.toggle("hidden");
}

/* FAQ TOGGLE */
function toggleFAQ(el) {
  const p = el.nextElementSibling;
  p.style.display = p.style.display === "block" ? "none" : "block";
}

/* CHAT LOGIC */
function sendMessage() {
  const input = document.getElementById("chatInput");
  const msg = input.value.trim();
  if (!msg) return;

  const messages = document.getElementById("chatMessages");

  const userDiv = document.createElement("div");
  userDiv.className = "user-msg";
  userDiv.textContent = msg;
  messages.appendChild(userDiv);

  input.value = "";

  setTimeout(() => {
    const botDiv = document.createElement("div");
    botDiv.className = "bot-msg";
    botDiv.textContent =
      "Thanks for your message! Our team will assist you shortly.";
    messages.appendChild(botDiv);
    messages.scrollTop = messages.scrollHeight;
  }, 800);
}
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let count = 0;

  cart.forEach(item => {
    count += Number(item.qty || 0);
  });

  const badge = document.getElementById("cartCount");
  if (badge) badge.textContent = count;
}

document.addEventListener("DOMContentLoaded", updateCartCount);
