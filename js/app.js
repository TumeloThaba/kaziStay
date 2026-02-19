// ===== Elements =====
const listingsContainer = document.getElementById('main-content');
const detailModal = document.getElementById('detailModal');
const detailCloseBtn = detailModal.querySelector('.close-modal');
const modalMainImage = detailModal.querySelector('.modal-main-image');
const modalThumbnails = detailModal.querySelector('.modal-thumbnails');
const galleryPrev = detailModal.querySelector('.gallery-nav.prev');
const galleryNext = detailModal.querySelector('.gallery-nav.next');

// ===== Gallery State =====
let listingsData = []; // will store uploaded properties
let currentImages = [];
let currentImageIndex = 0;

// ===== Render Listings =====
function renderListings() {
  listingsContainer.innerHTML = '';

  if(listingsData.length === 0) {
    listingsContainer.innerHTML = '<p style="text-align:center; margin-top:30px;">No listings yet. List a property to get started!</p>';
    return;
  }

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

  // Amenities
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
  renderModalForCurrentImages();
});

galleryNext.addEventListener('click', () => {
  if(currentImages.length === 0) return;
  currentImageIndex = (currentImageIndex + 1) % currentImages.length;
  renderModalForCurrentImages();
});

function renderModalForCurrentImages() {
  const listing = listingsData.find(l => l.images.includes(currentImages[currentImageIndex]));
  if(listing) updateModalGallery(listing);
}

// ===== Close Detail Modal =====
detailCloseBtn.addEventListener('click', () => {
  detailModal.classList.remove('active');
});

// Close modal if clicked outside content
detailModal.addEventListener('click', (e) => {
  if(e.target === detailModal) detailModal.classList.remove('active');
});

// ===== Add New Property from Form =====
const addForm = document.getElementById('addForm');
addForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const newListing = {
    id: Date.now(),
    ownerName: document.getElementById('ownerName').value,
    location: document.getElementById('location').value,
    propertyType: document.getElementById('propertyType').value,
    amenities: document.getElementById('amenities').value,
    price: parseFloat(document.getElementById('price').value),
    description: document.getElementById('description').value,
    images: []
  };

  // Handle multiple images
  const imageFiles = document.getElementById('propertyImage').files;
  for(let file of imageFiles) {
    const reader = new FileReader();
    reader.onload = (event) => {
      newListing.images.push(event.target.result);

      // Only render after all images loaded
      if(newListing.images.length === imageFiles.length) {
        listingsData.push(newListing);
        renderListings();
      }
    };
    reader.readAsDataURL(file);
  }

  // Reset form
  addForm.reset();
  document.getElementById('imagePreview').style.display = 'none';
  document.getElementById('addModal').classList.remove('active');
});

// ===== Initial Render =====
renderListings();
