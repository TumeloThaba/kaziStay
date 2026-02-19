// ===== Elements =====
const listRoomBtn = document.getElementById('listRoomBtn'); //(top button to open modal)
const addModal = document.getElementById('addModal');        // Modal overlay
const closeModalBtn = addModal.querySelector('.close-modal');
const addForm = document.getElementById('addForm');          // Form inside modal
const propertyImageInput = document.getElementById('propertyImage');
const imagePreview = document.getElementById('imagePreview');

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

// ===== Image Preview =====
propertyImageInput.addEventListener('change', () => {
  const file = propertyImageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      imagePreview.src = reader.result;
      imagePreview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.src = '';
    imagePreview.style.display = 'none';
  }
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
    price: document.getElementById('price').value.trim(),
    description: document.getElementById('description').value.trim(),
    imageFile: propertyImageInput.files[0] || null,
  };

  // Validation (basic)
  if (!propertyData.ownerName || !propertyData.location || !propertyData.propertyType || !propertyData.price) {
    alert("Please fill in all required fields (Name, Location, Type, Price).");
    return;
  }

  // Here you can handle saving to Firebase / API
  console.log("Property Uploaded:", propertyData);

  // Reset form
  addForm.reset();
  imagePreview.src = '';
  imagePreview.style.display = 'none';
  addModal.classList.remove('active');

  // Optional: success message
  alert("Property submitted successfully!");
});
