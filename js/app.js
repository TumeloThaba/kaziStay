// ===== SAFE ELEMENTS =====
const listingsContainer = document.getElementById('main-content');

const detailModal = document.getElementById('detailModal');
const detailCloseBtn = detailModal ? detailModal.querySelector('.close-modal') : null;
const modalMainImage = detailModal ? detailModal.querySelector('.modal-main-image') : null;
const modalThumbnails = detailModal ? detailModal.querySelector('.modal-thumbnails') : null;
const galleryPrev = detailModal ? detailModal.querySelector('.gallery-nav.prev') : null;
const galleryNext = detailModal ? detailModal.querySelector('.gallery-nav.next') : null;

const priceRangeInput = document.getElementById('priceRange');
const priceRangeDisplay = document.getElementById('priceRangeValue');

// ===== GLOBAL STATE ======
let listingsData = JSON.parse(localStorage.getItem("listings")) || [];
let currentImages = [];
let currentImageIndex = 0;

let currentCategory = "all";
let minPrice = 0;
let maxPrice = 20000;

// ===== RENDER LISTINGS =====
function renderListings(filteredData = listingsData) {
  if (!listingsContainer) return;

  listingsContainer.innerHTML = '';

  if (!filteredData.length) {
    listingsContainer.innerHTML = '<p style="text-align:center; margin-top:30px;">No properties found.</p>';
    return;
  }

  filteredData.forEach(listing => {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <div class="card-image">
        <img src="${listing.images[0] || 'https://via.placeholder.com/400x240'}" alt="Property Image">
      </div>
      <div class="card-content">
        <h3 class="card-title">${listing.propertyType} - ${listing.ownerName}</h3>
        <p class="card-location">${listing.location}</p>
        <p class="price">R${listing.price.toLocaleString()}</p>
        <p class="card-desc">${listing.description}</p>
        <p class="amenities">${listing.amenities}</p>
        <div class="card-buttons" style="display:flex; gap:8px; margin-top:10px;">
          <button class="card-btn view-btn">View Property</button>
          <button class="card-btn location-btn">Location</button>
        </div>
      </div>
    `;

    // ===== View Property Modal =====
    const viewBtn = card.querySelector('.view-btn');
    viewBtn.addEventListener('click', () => {
      currentImages = listing.images;
      currentImageIndex = 0;
      updateModalGallery(listing);
      if (detailModal) detailModal.classList.add('active');
    });

    // ===== Location Button =====
    const locationBtn = card.querySelector('.location-btn');
    locationBtn.addEventListener('click', () => {
      const mapUrl = `https://www.google.com/maps/search/${encodeURIComponent(listing.location)}`;
      window.open(mapUrl, '_blank');
    });

    listingsContainer.appendChild(card);
  });
}
// ===== MODAL GALLERY ======
function updateModalGallery(listing) {
  if (!detailModal || !modalMainImage || !modalThumbnails) return;

  modalMainImage.src = currentImages[currentImageIndex] || 'https://via.placeholder.com/400x240';
  detailModal.querySelector('.modal-title').textContent = `${listing.propertyType} - ${listing.ownerName}`;
  detailModal.querySelector('.modal-price').textContent = `R${listing.price.toLocaleString()}`;
  detailModal.querySelector('.modal-desc').textContent = listing.description;

  const modalLocation = detailModal.querySelector('.modal-location-link');
  modalLocation.textContent = listing.location;
  modalLocation.onclick = () => {
    const mapUrl = `https://www.google.com/maps/search/${encodeURIComponent(listing.location)}`;
    window.open(mapUrl, '_blank');
  };

  const amenitiesContainer = detailModal.querySelector('.modal-amenities');
  if (amenitiesContainer) {
    amenitiesContainer.innerHTML = listing.amenities.split(',').map(a => `<div class="amenity">${a.trim()}</div>`).join('');
  }

  // Thumbnails
  modalThumbnails.innerHTML = '';
  currentImages.forEach((imgSrc, index) => {
    const thumb = document.createElement('img');
    thumb.src = imgSrc;
    thumb.classList.add('modal-thumbnail');
    if (index === currentImageIndex) thumb.classList.add('active');

    thumb.addEventListener('click', () => {
      currentImageIndex = index;
      updateModalGallery(listing);
    });

    modalThumbnails.appendChild(thumb);
  });
}

function renderModalForCurrentImages() {
  const listing = listingsData.find(l => l.images.includes(currentImages[currentImageIndex]));
  if (listing) updateModalGallery(listing);
}
// ===== MODAL EVENTS ======
if (detailCloseBtn && detailModal) {
  detailCloseBtn.addEventListener('click', () => detailModal.classList.remove('active'));
}

if (detailModal) {
  detailModal.addEventListener('click', e => {
    if (e.target === detailModal) detailModal.classList.remove('active');
  });
}

if (galleryPrev) {
  galleryPrev.addEventListener('click', () => {
    if (currentImages.length === 0) return;
    currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
    renderModalForCurrentImages();
  });
}

if (galleryNext) {
  galleryNext.addEventListener('click', () => {
    if (currentImages.length === 0) return;
    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
    renderModalForCurrentImages();
  });
}
// ===== ADD PROPERTY FORM ======
const addForm = document.getElementById('addForm');
if (addForm) {
  addForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const imageFiles = document.getElementById('propertyImage').files;
    const imagesURLs = Array.from(imageFiles).map(f => URL.createObjectURL(f));

    const newListing = {
      id: Date.now(),
      ownerName: document.getElementById('ownerName').value,
      location: document.getElementById('location').value,
      propertyType: document.getElementById('propertyType').value,
      amenities: document.getElementById('amenities').value,
      price: parseFloat(document.getElementById('price').value),
      description: document.getElementById('description').value,
      images: imagesURLs
    };

    listingsData.push(newListing);
    renderListings();
    localStorage.setItem("listings", JSON.stringify(listingsData));

    addForm.reset();
    const previewContainer = document.getElementById('imagePreviewContainer');
    if (previewContainer) previewContainer.innerHTML = '';
    const addModal = document.getElementById('addModal');
    if (addModal) addModal.classList.remove('active');
  });
}
// ===== PRICE SLIDER ======
if (priceRangeInput && priceRangeDisplay) {
  function updatePriceSlider() {
    const value = parseInt(priceRangeInput.value);
    const max = parseInt(priceRangeInput.max);
    const percent = (value / max) * 100;

    priceRangeInput.style.background = `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${percent}%, #ddd ${percent}%, #ddd 100%)`;
    priceRangeDisplay.textContent = `R${value.toLocaleString()}`;

    const filtered = listingsData.filter(l => l.price <= value);
    renderListings(filtered);
  }

  priceRangeInput.addEventListener('input', updatePriceSlider);
  updatePriceSlider();
}
// ===== DESKTOP FILTERS ======
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-tag");
  const minInput = document.getElementById("desktop-priceMin");
  const maxInput = document.getElementById("desktop-priceMax");
  const minDisplay = document.getElementById("desktop-minPriceDisplay");
  const maxDisplay = document.getElementById("desktop-maxPriceDisplay");
  const rangeTrack = document.getElementById("desktop-rangeTrack");

  if (!filterButtons.length) return;

  // CATEGORY FILTER
  filterButtons.forEach(button => {
    button.addEventListener("click", function () {
      filterButtons.forEach(btn => btn.classList.remove("active"));
      this.classList.add("active");
      currentCategory = this.dataset.filter;
      applyFilters();
    });
  });

  // PRICE RANGE
  function updatePriceUI() {
    minPrice = parseInt(minInput.value);
    maxPrice = parseInt(maxInput.value);

    if (minPrice > maxPrice) [minPrice, maxPrice] = [maxPrice, minPrice];

    minDisplay.textContent = minPrice;
    maxDisplay.textContent = maxPrice;

    const minPercent = (minPrice / minInput.max) * 100;
    const maxPercent = (maxPrice / maxInput.max) * 100;
    rangeTrack.style.left = minPercent + "%";
    rangeTrack.style.width = (maxPercent - minPercent) + "%";

    applyFilters();
  }

  if (minInput && maxInput) {
    minInput.addEventListener("input", updatePriceUI);
    maxInput.addEventListener("input", updatePriceUI);
    updatePriceUI();
  }
});

// ===== APPLY FILTERS ======
function applyFilters() {
  const filtered = listingsData.filter(listing => {
    const matchesCategory = currentCategory === "all" || listing.propertyType === currentCategory;
    const matchesPrice = listing.price >= minPrice && listing.price <= maxPrice;
    return matchesCategory && matchesPrice;
  });

  renderListings(filtered);
}
// ===== INITIAL RENDER ======
renderListings();
