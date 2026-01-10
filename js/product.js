(function initProductPage() {

  const container = document.getElementById("productContainer");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  const product = PRODUCTS.find(p => p.id === productId);

  if (!product) {
    container.innerHTML = "<p>Product not found.</p>";
    return;
  }

  /* =========================
     SEO (FROM DATA.JS)
     ========================= */
  const seoTitle = document.getElementById("seoTitle");
  const seoDesc = document.getElementById("seoDesc");

  if (seoTitle) {
    seoTitle.textContent =
      product.seo?.title || `${product.name} | AutoFits USA`;
  }

  if (seoDesc) {
    seoDesc.content =
      product.seo?.description ||
      `Buy ${product.name}. Guaranteed fit, fast USA shipping.`;
  }

  /* =========================
     IMAGES
     ========================= */
  const images = product.images?.length
    ? product.images
    : ["images/placeholder.webp"];

  let currentIndex = 0;

  /* =========================
     HTML RENDER
     ========================= */
  container.innerHTML = `
    <div class="product-images">
      <div class="image-wrapper">
        <button class="img-nav left" id="prevImg">‹</button>
        <img id="mainImage" src="${images[0]}" alt="${product.name}">
        <button class="img-nav right" id="nextImg">›</button>
      </div>

      <div class="thumbs">
        ${images.map((img, i) =>
          `<img src="${img}" class="thumb ${i === 0 ? "active" : ""}" data-index="${i}">`
        ).join("")}
      </div>
    </div>

    <div class="product-details">
      <h1>${product.name}</h1>

      <div class="price-box">
        ${product.mrp ? `<span class="mrp">$${product.mrp}</span>` : ""}
        <span class="selling">$${product.price}</span>
      </div>

      <div class="meta">
        <div><strong>Part Number:</strong> ${product.partNumber || "OEM Compatible"}</div>
        <div><strong>Condition:</strong> ${product.condition || "Used OEM"}</div>
        <div><strong>Warranty:</strong> ${product.warranty || "Seller Warranty"}</div>
        <div><strong>Interior Trim Code:</strong> ${product.interiorTrimCode || "OEM Standard"}</div>
        <div><strong>Donor Vehicle:</strong> ${product.donorVehicle || "OEM Donor Vehicle"}</div>
      </div>

      <ul class="features">
        <li>✅ Guaranteed Fit</li>
        <li>🛡️ OEM Quality Tested</li>
        <li>🔄 Easy Returns</li>
        <li>🚚 Fast USA Shipping</li>
      </ul>

      <div class="actions">
        <button class="add-btn" onclick="addItem('${product.id}')">
          Add to Cart
        </button>
        
      </div>

      <div class="product-section">
  <h2>Description</h2>

  <p class="long-desc">
    ${product.description || "OEM compatible replacement part."}
  </p>

  ${
    product.highlights && product.highlights.length
      ? `
        <ul class="product-highlights">
          ${product.highlights
            .map(point => `<li>${point}</li>`)
            .join("")}
        </ul>
      `
      : ""
  }
</div>


      <div class="product-section">
        <h2>Compatible Vehicles</h2>
        <ul class="compat-list">
          ${(product.compatibleVehicles || []).map(v =>
            `<li>${v.year} ${v.make} ${v.model}${v.engine ? " • " + v.engine : ""}</li>`
          ).join("")}
        </ul>
      </div>
    </div>
  `;

  /* =========================
     IMAGE NAVIGATION
     ========================= */
  const mainImage = document.getElementById("mainImage");
  const thumbs = document.querySelectorAll(".thumb");

  function updateImage(index) {
    currentIndex = index;
    mainImage.src = images[index];
    thumbs.forEach(t => t.classList.remove("active"));
    thumbs[index].classList.add("active");
  }

  document.getElementById("prevImg").onclick = () =>
    updateImage((currentIndex - 1 + images.length) % images.length);

  document.getElementById("nextImg").onclick = () =>
    updateImage((currentIndex + 1) % images.length);

  thumbs.forEach(t =>
    t.addEventListener("click", () =>
      updateImage(parseInt(t.dataset.index))
    )
  );

  /* =========================
     ZOOM (DESKTOP + MOBILE)
     ========================= */
  let zoomed = false;

  mainImage.addEventListener("dblclick", () => {
    zoomed = !zoomed;
    mainImage.style.transform = zoomed ? "scale(1.8)" : "scale(1)";
  });

  mainImage.addEventListener("touchend", () => {
    zoomed = !zoomed;
    mainImage.style.transform = zoomed ? "scale(1.6)" : "scale(1)";
  });





  updateCartCount();

})();

function goToCart() {
  window.location.href = "cart.html";
}
