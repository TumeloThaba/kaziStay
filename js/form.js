document.addEventListener("DOMContentLoaded", () => {

  // ===== SAFE ELEMENTS =====
  const listRoomBtn = document.getElementById('listRoomBtn');
  const addModal = document.getElementById('addModal');
  const closeModalBtn = addModal ? addModal.querySelector('.close-modal') : null;
  const addForm = document.getElementById('addForm');
  const propertyImagesInput = document.getElementById('propertyImages');
  const imagesPreviewContainer = document.getElementById('imagesPreviewContainer');

  if (!listRoomBtn || !addModal || !addForm || !propertyImagesInput || !imagesPreviewContainer) return;

  // ===== Open Modal =====
  listRoomBtn.addEventListener('click', () => addModal.classList.add('active'));

  // ===== Close Modal =====
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => addModal.classList.remove('active'));
  }

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
    e.preventDefault();

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

    // Convert uploaded files to object URLs
    const imagesURLs = propertyData.images.map(file => URL.createObjectURL(file));

    // ===== PUSH TO EXISTING listingsData from app.js =====
    if (window.listingsData && Array.isArray(window.listingsData)) {
      window.listingsData.push({
        id: Date.now(),
        ...propertyData,
        images: imagesURLs
      });

      localStorage.setItem("listings", JSON.stringify(window.listingsData));
      if (typeof window.renderListings === "function") {
        window.renderListings();
      }
    }

    // Reset form
    addForm.reset();
    imagesPreviewContainer.innerHTML = '';
    addModal.classList.remove('active');

    console.log('New property added:', propertyData);
  });

});
