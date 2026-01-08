const orders = [
  {
    id: "AFU12345",
    date: "Jan 2, 2026",
    total: "$249.99",
    status: "Shipped"
  },
  {
    id: "AFU12312",
    date: "Dec 28, 2025",
    total: "$129.00",
    status: "Delivered"
  }
];

const container = document.getElementById("ordersList");

orders.forEach(o => {
  const div = document.createElement("div");
  div.className = "order-card";

  div.innerHTML = `
    <h3>Order #${o.id}</h3>
    <p>Date: ${o.date}</p>
    <p>Total: ${o.total}</p>
    <p>Status: <span class="status">${o.status}</span></p>
  `;

  container.appendChild(div);
});
