// ===== Elements =====
const listingsContainer = document.getElementById('listingsContainer');
const detailModal = document.getElementById('detailModal');
const detailCloseBtn = detailModal.querySelector('.close-modal');
const modalMainImage = detailModal.querySelector('.modal-main-image');
const modalThumbnails = detailModal.querySelector('.modal-thumbnails');
const galleryPrev = detailModal.querySelector('.gallery-nav.prev');
const galleryNext = detailModal.querySelector('.gallery-nav.next');

// ===== Sample Listings Data =====
let listingsData = [
  {
    id: 1,
    ownerName: "John Doe",
    location: "Sasolburg, Free State",
    propertyType: "Apartment",
    amenities: "WiFi, Television, Parking",
    price: 4500,
    description: "Cozy 2-bedroom apartment close to downtown.",
    images: [
      "https://via.placeholder.com/400x300",
      "https://via.placeholder.com/400x300/aaaaaa",
      "https://via.placeholder.com/400x300/cccccc"
    ]
  },
  {
    id: 2,
    ownerName: "Jane Smith",
    location: "Vaalpark, Free State",
    propertyType: "Single Room",
    amenities: "WiFi, TV",
    price: 2500,
    description: "Single room in a quiet neighborhood.",
    images: [
      "https://via.placeholder.com/400x300",
    ]
  }
];

// ===== Gallery State =====
let currentImages = [];
let currentImageIndex = 0;

// ===== Render Listings =====
function renderListings() {
  listingsContainer.innerHTML = "";

  listingsData.forEach(listing => {
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
          <button class="card-btn view-btn">View Property/Room</button>
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

    // ===== Location button =====
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
  // Main image
  modalMainImage.src = currentImages[currentImageIndex];

  // Modal details
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
    if(index === currentImageIndex) thumb.classList.add('active');

    thumb.addEventListener('click', () => {
      currentImageIndex = index;
      updateModalGallery(listing);
    });

    modalThumbnails.appendChild(thumb);
  });
}

// ===== Gallery Navigation =====
galleryPrev.addEventListener('click', () => {
  if(currentImages.length === 0) return;
  currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
  updateModalGallery(listingsData.find(l => l.images === currentImages));
});

galleryNext.addEventListener('click', () => {
  if(currentImages.length === 0) return;
  currentImageIndex = (currentImageIndex + 1) % currentImages.length;
  updateModalGallery(listingsData.find(l => l.images === currentImages));
});

// ===== Close Detail Modal =====
detailCloseBtn.addEventListener('click', () => {
  detailModal.classList.remove('active');
});

// Close modal if clicked outside content
detailModal.addEventListener('click', (e) => {
  if (e.target === detailModal) {
    detailModal.classList.remove('active');
  }
});

// ===== Initial Render =====
renderListings();

