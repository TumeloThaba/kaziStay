const addModal = document.getElementById("addModal");

// Open modal
function openAddModal() {
  addModal.classList.add("active");
}

// Close modal
function closeAddModal() {
  addModal.classList.remove("active");
}

// Close modal when clicking outside content
addModal.addEventListener("click", (e) => {
  if (e.target === addModal) closeAddModal();
});

// Hook up close button
document.querySelectorAll("#addModal .close-modal").forEach(btn => {
  btn.addEventListener("click", closeAddModal);
});
