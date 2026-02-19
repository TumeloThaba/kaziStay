// ===== Elements =====
const listRoomBtn = document.getElementById('listRoomBtn'); // "List a Room" button
const addModal = document.getElementById('addModal');        // Modal overlay
const closeModalBtn = addModal.querySelector('.close-modal');
const addForm = document.getElementById('addForm');          // Form inside modal
const propertyImagesInput = document.getElementById('propertyImages');
const imagesPreviewContainer = document.getElementById('imagesPreviewContainer');

// ===== Open Modal =====
listRoomBtn.addEventListener('click', () => {
  addModal.classList.add('active');
});

// ===== Close Modal =====
closeModalBtn.addEventListener('click', () => {
  addModal.classList.remove('active');
});

// Close modal if clicked outside content
addModal.addEventListener('click', (e) => {
  if (e.target === addModal) addModal.classList.remove('active');
});

// ===== Image Preview for Multiple Files =====
propertyImagesInput.addEventListener('change', () => {
  imagesPreviewContainer.innerHTML = ''; // Clear previous previews
  const files = propertyImagesInput.files;
  
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = document.createElement('img');
      img.src = reader.result;
      img.style.width = '100px';
      img.style.height = '80px';
      img.style.objectFit = 'cover';
      img.style.marginRight = '8px';
      img.style.marginBottom = '8px';
      img.style.borderRadius = '8px';
      imagesPreviewContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});

// ===== Form Submit =====
addForm.addEventListener('submit', (e) => {
  e.preventDefault(); // prevent page reload

  // Collect form data
  const propertyData = {
    ownerName: document.getElementById('ownerName').value.trim(),
    location: document.getElementById('location').value.trim(),
    propertyType: document.getElementById('propertyType').value,
    amenities: document.getElementById('amenities').value.trim(),
    price: Number(document.getElementById('price').value),
    description: document.getElementById('description').value.trim(),
    images: Array.from(propertyImagesInput.files)
  };

  // Convert uploaded files to object URLs for display
  const imagesURLs = propertyData.images.map(file => URL.createObjectURL(file));

  listingsData.push({
  id: listingsData.length + 1,
  ...propertyData,
  images: propertyData.images.map(f => URL.createObjectURL(f))
});

localStorage.setItem("listings", JSON.stringify(listingsData));
renderListings();

  // Re-render listings on homepage
  renderListings();

  // Reset form
  addForm.reset();
  imagesPreviewContainer.innerHTML = '';
  addModal.classList.remove('active');

  console.log('New property added:', propertyData);
});
