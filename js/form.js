// Elements
const listRoomBtn = document.getElementById('listRoomBtn'); // Button to open modal
const addModal = document.getElementById('addModal');
const closeModalBtn = addModal.querySelector('.close-modal');
const addForm = document.getElementById('addForm');

// Open modal
listRoomBtn.addEventListener('click', () => {
  addModal.classList.add('active');
});

// Close modal
closeModalBtn.addEventListener('click', () => {
  addModal.classList.remove('active');
});

// Close modal by clicking outside content
addModal.addEventListener('click', (e) => {
  if (e.target === addModal) {
    addModal.classList.remove('active');
  }
});

// Handle form submit
addForm.addEventListener('submit', (e) => {
  e.preventDefault(); // prevent page reload

  // Collect data
  const propertyData = {
    ownerName: document.getElementById('ownerName').value,
    location: document.getElementById('location').value,
    propertyType: document.getElementById('propertyType').value,
    amenities: document.getElementById('amenities').value,
    price: document.getElementById('price').value,
    description: document.getElementById('description').value,
    imageFile: document.getElementById('propertyImage').files[0] || null,
  };

  console.log("Property Uploaded:", propertyData);

  // Reset form
  addForm.reset();
  addModal.classList.remove('active');

  // Optional: show success message/modal here
});
