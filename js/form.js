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
  if (e.target === addModal) {
    addModal.classList.remove('active');
  }
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
    ownerName: document.getElementById('ownerName').value,
    location: document.getElementById('location').value,
    propertyType: document.getElementById('propertyType').value,
    amenities: document.getElementById('amenities').value,
    price: document.getElementById('price').value,
    description: document.getElementById('description').value,
    images: Array.from(propertyImagesInput.files) || []
  };

  console.log("Property Uploaded:", propertyData);

  // Optional: push to your listingsData and re-render
  listingsData.push({
    id: listingsData.length + 1,
    ...propertyData,
    images: propertyData.images.map(f => URL.createObjectURL(f)) // for preview/testing
  });

  renderListings(); // refresh property cards

  // Reset form
  addForm.reset();
  imagesPreviewContainer.innerHTML = '';
  addModal.classList.remove('active');
});
