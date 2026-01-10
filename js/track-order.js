function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("show");
}
document.getElementById("trackForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const result = document.getElementById("orderResult");

  // For now, static logic (HONEST)
  result.innerHTML = `
    <h3>📦 Order Status: <span style="color:#2563eb">Processing</span></h3>
    <p>
      Your order is currently being processed or has been shipped.
      <br><br>
      📧 Please check your email for detailed tracking information.
      <br>
      If you need help, contact support.
    </p>
  `;
});
