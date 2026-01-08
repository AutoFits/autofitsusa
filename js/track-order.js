function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("show");
}
function trackOrder() {
  const orderId = document.getElementById("orderId").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!orderId || !email) {
    alert("Please enter both Order ID and Email.");
    return;
  }

  // =============================
  // MOCK DATA (Replace later)
  // =============================
  const mockTracking = {
    trackingNumber: "940011189922385692XXXX",
    deliveryDate: "Jan 10, 2026",
    statusStep: 2 // 0=confirmed,1=processing,2=shipped...
  };

  document.getElementById("trackingResult").classList.remove("hidden");
  document.getElementById("trackingNumber").textContent = mockTracking.trackingNumber;
  document.getElementById("deliveryDate").textContent = mockTracking.deliveryDate;

  const steps = document.querySelectorAll(".step");
  steps.forEach((step, index) => {
    step.classList.toggle("active", index <= mockTracking.statusStep);
  });
}

/*
=================================
 FUTURE USPS INTEGRATION POINT
=================================

Replace mockTracking with:

fetch("/api/track-order", {
  method: "POST",
  body: JSON.stringify({ orderId, email })
})

Backend will:
- Validate order
- Call USPS API
- Return live status + ETA
*/
