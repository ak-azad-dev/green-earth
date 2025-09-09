// Function to load All Categories
const loadAllCategories = () => {
  const url = "https://openapi.programming-hero.com/api/categories";
  fetch(url)
    .then((res) => res.json())
    .then((res) => displayCategories(res.categories));
};

const removeActiveCategory = () => {
  const btnCategory = document.querySelectorAll(".btn-category");
  btnCategory.forEach((btn) => btn.classList.remove("active"));
};

// Function to load spinner based on status
const loadSpinner = (status) => {
  const loader = document.getElementById("loader");
  if (status) {
    loader.style.display = "flex";
    document.getElementById("plantContainer").classList.add("hidden");
  } else {
    loader.style.display = "none";
    document.getElementById("plantContainer").classList.remove("hidden");
  }
};

// Function to load All Plants
const loadAllPlants = (id) => {
  loadSpinner(true);
  const url = "https://openapi.programming-hero.com/api/plants";
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      if (id !== undefined) {
        removeActiveCategory(); // Remove active category
        const btnStaticCategory = document.getElementById(`category-${id}`);
        btnStaticCategory.classList.add("active");
      }
      displayPlants(res.plants);
    });
};

// Function to get Plants By Category Id
const getPlantsByCategoryId = (id) => {
  loadSpinner(true);
  const url = `https://openapi.programming-hero.com/api/category/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      removeActiveCategory();
      const btnCategory = document.getElementById(`category-${id}`);
      btnCategory.classList.add("active");
      displayPlants(res.plants);
    });
};

// Function to get Plants Details By Plant Id
const getPlantsDetailById = (id) => {
  const url = `https://openapi.programming-hero.com/api/plant/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((res) => displayModal(res.plants));
};

// Function to display Cart on Mobile Device
const displayCartToMobile = () => {
  const desktopCart = document.getElementById("desktopCartContainer");
  const mobileCart = document.getElementById("mobileCartContainer");
  mobileCart.innerHTML = desktopCart.innerHTML;

  // Total amount
  const desktopTotalCartAmount =
    document.getElementById("desktopCartAmount").innerText;
  document.getElementById("mobileCartAmount").innerText =
    desktopTotalCartAmount;

  // Checkout button
  const desktopBtn = document.getElementById("btnCheckoutDesktop");
  const mobileBtn = document.getElementById("btnCheckoutMobile");
  if (desktopBtn.classList.contains("hidden")) {
    mobileBtn.classList.add("hidden");
  } else {
    mobileBtn.classList.remove("hidden");
  }
};

// Function to add cart item
const addToCart = (id, name, price, event) => {
  event.stopPropagation();
  alert(`✅ ${name} has been added to the cart.`);

  const desktopCartContainer = document.getElementById("desktopCartContainer");
  const cartItem = document.createElement("div");
  cartItem.innerHTML = `
    <div class="bg-[#F0FDF4] rounded-lg p-4 mb-4 flex items-center justify-between mt-2" id="item-${id}">
        <div class="flex-col items-center">
            <div class="text-[#111111] font-normal text-[16px]">${name}</div>
            <div class="mt-1 text-[#5c5c5c] font-normal text-[16px]">৳${price} x 1</div>
        </div>
        <div class="text-[#111111] font-normal text-[16px]">
            <i class="fa-solid fa-xmark cursor-pointer hover:text-red-600" onclick="deleteCartItem(${id}, ${price})"></i>
        </div>
    </div>`;
  desktopCartContainer.append(cartItem);

  calculateCartTotalAmount(price); // Calculate total cart amount
  displayCartToMobile(); // Display cart item on mobile

  // Increment cart badge count on mobile
  const cartCount = document.getElementById("mobileCartCount");
  let totalCount = parseInt(cartCount.innerText);
  totalCount += 1;
  cartCount.innerText = totalCount;
};

// Function to delete cart item
const deleteCartItem = (id, price) => {
  document.getElementById(`item-${id}`).remove();
  calculateCartTotalAmount(-price);
  displayCartToMobile();

  // Decrement cart badge count on mobile
  const cartCount = document.getElementById("mobileCartCount");
  let totalCount = parseInt(cartCount.innerText);
  totalCount -= 1;
  cartCount.innerText = totalCount;
};

// Function to calculate Cart Total Amount
const calculateCartTotalAmount = (price) => {
  const desktopCartAmount = document.getElementById("desktopCartAmount");
  let totalAmount = Number(desktopCartAmount.innerText);
  totalAmount += price;
  desktopCartAmount.innerText = parseFloat(totalAmount).toFixed(2);

  // Show/Hide Checkout button
  const btnCheckoutDesktop = document.getElementById("btnCheckoutDesktop");
  const btnCheckoutMobile = document.getElementById("btnCheckoutMobile");
  if (totalAmount === 0) {
    btnCheckoutDesktop.classList.add("hidden");
    btnCheckoutMobile.classList.add("hidden");
  } else {
    btnCheckoutDesktop.classList.remove("hidden");
    btnCheckoutMobile.classList.remove("hidden");
  }
};

// Function to display Categories sidebar menu
const displayCategories = (categories) => {
  const categoriesContainer = document.getElementById("categoriesContainer");
  categoriesContainer.innerHTML = "";

  // Static "All Trees"
  const staticCategoryElement = document.createElement("div");
  staticCategoryElement.innerHTML = `
    <li class="w-[150px] md:w-[200px] active btn-category rounded mb-1 items-center md:items-start" id="category-0" onclick="loadAllPlants(0)">
      <a class="hover:bg-[#15803D] w-[150px] md:w-[200px] hover:text-white">All Trees</a>
    </li>`;
  categoriesContainer.append(staticCategoryElement);

  // Dynamic categories
  categories.forEach((category) => {
    const categoriesElement = document.createElement("div");
    categoriesElement.innerHTML = `
      <li class="w-[150px] md:w-[200px] btn-category rounded mb-1 items-center md:items-start" id="category-${category.id}" onclick="getPlantsByCategoryId(${category.id})">
        <a class="hover:bg-[#15803D] w-[150px] md:w-[200px] hover:text-white">${category.category_name}</a>
      </li>`;
    categoriesContainer.append(categoriesElement);
  });
};

// Function to display plants card
const displayPlants = (plants) => {
  const plantContainer = document.getElementById("plantContainer");
  plantContainer.innerHTML = "";

  plants.forEach((plant) => {
    const plantsElement = document.createElement("div");
    plantsElement.innerHTML = `
      <div class="card bg-[#FFFFFF] w-full sm:w-[300px] md:w-[260px] shadow-sm rounded-lg
          transition duration-300 ease-in-out hover:scale-105 mx-auto"
          onclick="getPlantsDetailById(${plant.id})">
        <figure class="px-4 py-4">
          <img src=${plant.image} alt="${plant.name}" class="rounded-xl h-[180px] w-full object-cover" />
        </figure>
        <div class="card-body items-start text-left pt-0 pb-4">
          <h2 class="card-title text-[14px] font-semibold text-[#1F2937] leading-5">${plant.name}</h2>
          <p class="text-[12px] font-normal text-[#1F2937] leading-4 mt-2 line-clamp-3">${plant.description}</p>
          <div class="card-actions w-full justify-between mt-2">
            <div class="badge badge-outline bg-[#DCFCE7] text-[#15803D] border-none rounded-[400px] text-[14px] font-medium left-1">${plant.category}</div>
            <div class="text-[14px] font-semibold text-[#1F2937] leading-5">৳${plant.price}</div>
          </div>
          <div class="card-actions w-full mt-3" onclick="addToCart(${plant.id}, '${plant.name}', ${plant.price}, event)">
            <button class="btn btn-primary w-full bg-[#15803D] hover:bg-[#FACC15] border-none shadow-none rounded-[999px]
                    text-white text-base font-medium">Add to Cart</button>
          </div>
        </div>
      </div>`;
    plantContainer.append(plantsElement);
  });

  loadSpinner(false);
};

// Function to display plants details modal on click card
const displayModal = (plantDetails) => {
  const modal = document.getElementById("my_modal");
  modal.showModal();
  modal.innerHTML = "";
  const modalElement = document.createElement("div");
  modalElement.innerHTML = `
    <div class="modal-box">
      <h3 class="text-lg font-bold">${plantDetails.name}</h3>
      <figure class="px-1 py-2">
        <img src=${plantDetails.image} alt="${plantDetails.name}" class="rounded-xl h-[200px] w-full object-cover" />
      </figure>
      <div class="card-actions w-full justify-between mt-3">
        <div class="badge badge-outline bg-[#DCFCE7] text-[#15803D] border-none rounded-[400px] text-[14px] font-medium left-1">${plantDetails.category}</div>
        <div class="text-[14px] font-semibold text-[#1F2937] leading-5"><span class="font-bold">Price:</span> ৳${plantDetails.price}</div>
      </div>
      <p class="py-2 text-[14px] mt-2"><span class="font-bold">Description:</span> ${plantDetails.description}</p>
      <div class="modal-action">
        <form method="dialog" class="!flex !justify-between !items-center w-full">
          <button class="btn hover:bg-red-600 hover:text-white rounded-[999px]">Close</button>
          <button onclick="addToCart(${plantDetails.id}, '${plantDetails.name}', ${plantDetails.price}, event)" class="btn btn-primary bg-[#15803D] hover:bg-[#FACC15] border-none shadow-none rounded-[999px] text-white text-base font-medium">Add to Cart</button>
        </form>
      </div>
    </div>`;
  modal.append(modalElement);
};

// Function to show/hide mobile card modal
const toggleMobileCartModal = () => {
  const modal = document.getElementById("mobileCartModal");
  modal.open ? modal.close() : modal.showModal();
};

// Function to displayCartToMobile & toggleMobileCartModal
document.getElementById("mobileCartBtn").addEventListener("click", () => {
  displayCartToMobile();
  toggleMobileCartModal();
});

// Function to handle checkout on mobile
const checkoutMobile = () => {
  alert("✅ Your order has been confirmed! We will deliver it soon.");
  document.getElementById("mobileCartModal").close();
};

// Load init function on page load
loadAllCategories();
loadAllPlants();
