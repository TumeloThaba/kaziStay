// ===== Elements =====
const listingsContainer = document.getElementById('main-content');
const detailModal = document.getElementById('detailModal');
const detailCloseBtn = detailModal.querySelector('.close-modal');
const modalMainImage = detailModal.querySelector('.modal-main-image');
const modalThumbnails = detailModal.querySelector('.modal-thumbnails');
const galleryPrev = detailModal.querySelector('.gallery-nav.prev');
const galleryNext = detailModal.querySelector('.gallery-nav.next');

const priceRangeInput = document.getElementById('priceRange');
const priceRangeDisplay = document.getElementById('priceRangeValue');

// ===== Gallery State =====
let listingsData = JSON.parse(localStorage.getItem("listings")) || []; // Will store all properties
let currentImages = [];
let currentImageIndex = 0;

// ===== Render Listings =====
function renderListings(filteredData = listingsData) {
  listingsContainer.innerHTML = '';

  if (filteredData.length === 0) {
    listingsContainer.innerHTML = '<p style="text-align:center; margin-top:30px;">No listings available for this price range.</p>';
    return;
  }

  filteredData.forEach(listing => {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <div class="card-image">
        <img src="${listing.images[0]}" alt="Property Image">
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
      detailModal.classList.add('active');
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

// ===== Update Modal Gallery =====
function updateModalGallery(listing) {
  modalMainImage.src = currentImages[currentImageIndex];
  detailModal.querySelector('.modal-title').textContent = `${listing.propertyType} - ${listing.ownerName}`;
  detailModal.querySelector('.modal-price').textContent = `R${listing.price.toLocaleString()}`;
  detailModal.querySelector('.modal-desc').textContent = listing.description;

  const modalLocation = detailModal.querySelector('.modal-location-link');
  modalLocation.textContent = listing.location;
  modalLocation.onclick = () => {
    const mapUrl = `https://www.google.com/maps/search/${encodeURIComponent(listing.location)}`;
    window.open(mapUrl, '_blank');
  };

  detailModal.querySelector('.modal-amenities').innerHTML =
    listing.amenities.split(',').map(a => `<div class="amenity">${a.trim()}</div>`).join('');

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

// ===== Gallery Navigation =====
galleryPrev.addEventListener('click', () => {
  if (currentImages.length === 0) return;
  currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
  renderModalForCurrentImages();
});

galleryNext.addEventListener('click', () => {
  if (currentImages.length === 0) return;
  currentImageIndex = (currentImageIndex + 1) % currentImages.length;
  renderModalForCurrentImages();
});

function renderModalForCurrentImages() {
  const listing = listingsData.find(l => l.images.includes(currentImages[currentImageIndex]));
  if (listing) updateModalGallery(listing);
}

// ===== Close Detail Modal =====
detailCloseBtn.addEventListener('click', () => detailModal.classList.remove('active'));
detailModal.addEventListener('click', (e) => {
  if (e.target === detailModal) detailModal.classList.remove('active');
});

// ===== Add New Property from Form =====
const addForm = document.getElementById('addForm');
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

  addForm.reset();
  document.getElementById('imagePreviewContainer').innerHTML = '';
  document.getElementById('addModal').classList.remove('active');
});

// ===== Price Range Slider Functionality =====
if (priceRangeInput && priceRangeDisplay) {
  function updatePriceSlider() {
    const value = parseInt(priceRangeInput.value);
    const max = parseInt(priceRangeInput.max);
    const percent = (value / max) * 100;

    // Update slider fill dynamically
    priceRangeInput.style.background = `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${percent}%, #ddd ${percent}%, #ddd 100%)`;

    priceRangeDisplay.textContent = `R${value.toLocaleString()}`;
    const filtered = listingsData.filter(l => l.price <= value);
    renderListings(filtered);
  }

  priceRangeInput.addEventListener('input', updatePriceSlider);
  updatePriceSlider(); // initial fill on load
}
 // ===== DESKTOP FILTER SYSTEM =====

let currentCategory = "all";
let minPrice = 0;
let maxPrice = 20000;

document.addEventListener("DOMContentLoaded", function () {

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

    if (minPrice > maxPrice) {
      [minPrice, maxPrice] = [maxPrice, minPrice];
    }

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


// ===== APPLY FILTERS TO EXISTING RENDER =====
function applyFilters() {

  const filtered = listingsData.filter(listing => {

    const matchesCategory =
      currentCategory === "all" ||
      listing.propertyType === currentCategory;

    const matchesPrice =
      listing.price >= minPrice &&
      listing.price <= maxPrice;

    return matchesCategory && matchesPrice;
  });

  renderListings(filtered);
}
