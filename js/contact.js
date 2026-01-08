function openWhatsApp() {
  window.open("https://wa.me/1XXXXXXXXXX", "_blank");
}

document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();

  const status = document.getElementById("formStatus");
  status.textContent = "Message sent successfully. We’ll get back to you shortly.";
  status.style.color = "green";

  e.target.reset();
});

function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("show");
}
