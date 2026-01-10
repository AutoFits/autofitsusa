function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("show");
}

function openWhatsApp() {
  window.open("https://wa.me/1XXXXXXXXXX", "_blank");
}

document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const status = document.getElementById("contactStatus");
  status.textContent = "Sending...";

  const data = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    message: document.getElementById("message").value.trim(),
  };

  try {
    const res = await fetch("/.netlify/functions/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      status.textContent = "✅ Message sent! We’ll get back to you shortly.";
      e.target.reset();
    } else {
      status.textContent = "❌ Failed to send message.";
    }
  } catch {
    status.textContent = "❌ Something went wrong.";
  }
});
