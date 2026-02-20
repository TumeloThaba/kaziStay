// Sample data for listings
const listingsData = [
  {
    id: 1,
    title: "Cozy Apartment",
    location: "Sasolburg",
    price: "R3500",
    image: "https://via.placeholder.com/400x240",
    verified: true,
    amenities: ["Wi-Fi", "Parking", "Pool"]
  },
  {
    id: 2,
    title: "Luxury Condo",
    location: "Vaalpark",
    price: "R5500",
    image: "https://via.placeholder.com/400x240",
    verified: false,
    amenities: ["Wi-Fi", "Gym", "AC"]
  }
];

// Render listings into the main grid
function renderListings() {
  const main = document.getElementById("main-content");
  main.innerHTML = `
    <section class="section-header">
      <h2>Available Rooms</h2>
    </section>
    <div class="grid">
      ${listingsData.map(item => `
        <div class="card">
          <div class="card-image">
            <img src="${item.image}" alt="${item.title}">
            ${item.verified ? '<span class="badge badge-verified">Verified</span>' : ''}
          </div>
          <div class="card-content">
            <h3 class="card-title">${item.title}</h3>
            <p class="card-location">${item.location}</p>
            <p class="price">${item.price}</p>
            <button class="card-btn" onclick="openAddModal()">view property</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", renderListings);
