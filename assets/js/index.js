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

const getAllPlants = (id) => {
  loadSpinner(true);
  const url = "https://openapi.programming-hero.com/api/plants";
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      if (id !== undefined) {
        removeActiveCategory(); //Remove active category
        const btnStaticCategory = document.getElementById(`category-${id}`);
        btnStaticCategory.classList.add("active");
        displayPlants(res.plants);
      } else {
        displayPlants(res.plants); //Display all plants
      }
    });
};

const getPlantsByCategoryId = (id) => {
  loadSpinner(true);
  const url = `https://openapi.programming-hero.com/api/category/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((res) => {
      removeActiveCategory(); //Remove active category
      const btnCategory = document.getElementById(`category-${id}`);
      btnCategory.classList.add("active");
      displayPlants(res.plants); //Display plants by category Id
    });
};

const getPlantsDetailById = (id) => {
  const url = `https://openapi.programming-hero.com/api/plant/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((res) => displayModal(res.plants));
};

const addToCart = (id, name, price, event) => {
  event.stopPropagation();
  //Display alert message with item name
  alert(`✅ ${name} has been added to the cart.`);

  const cartContainer = document.getElementById("cartContainer");
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
  cartContainer.append(cartItem);

  //Display checkout btn
  const btnCheckout = document.getElementById("btnCheckout");
  btnCheckout.classList.remove("hidden");

  //Calculate added cart total amount
  calculateCartTotalAmount(price);
};

const deleteCartItem = (id, price) => {
  const cartItem = document.getElementById(`item-${id}`);
  cartItem.remove();

  //Calculate added cart total amount
  calculateCartTotalAmount(-price);
};

const calculateCartTotalAmount = (price) => {
  const cartAmount = document.getElementById("cartAmount");
  let totalAmount = Number(cartAmount.innerText);
  totalAmount += price;
  cartAmount.innerText = parseFloat(totalAmount).toFixed(2);

  //Hide checkout btn
  if (totalAmount === 0) {
    const btnCheckout = document.getElementById("btnCheckout");
    btnCheckout.classList.add("hidden");
  }
};

const displayCategories = (categories) => {
  const categoriesContainer = document.getElementById("categoriesContainer");
  categoriesContainer.innerHTML = "";

  // Added static "All Trees" category
  const staticCategoryElement = document.createElement("div");
  staticCategoryElement.innerHTML = `
      <li class="w-[150px] md:w-[200px] active btn-category rounded mb-1 items-center md:items-start" id="category-0" onclick="getAllPlants(0)"><a class="hover:bg-[#15803D] w-[150px] md:w-[200px] hover:text-white">All Trees</a></li>
  `;
  categoriesContainer.append(staticCategoryElement);

  // Added dynamic categories
  categories.forEach((category) => {
    const categoriesElement = document.createElement("div");
    categoriesElement.innerHTML = `
        <li class="w-[150px] md:w-[200px] btn-category rounded mb-1 items-center md:items-start" id="category-${category.id}" onclick="getPlantsByCategoryId(${category.id})"><a class="hover:bg-[#15803D] w-[150px] md:w-[200px] hover:text-white">${category.category_name}</a></li>
    `;
    categoriesContainer.append(categoriesElement);
  });
};

const displayPlants = (plants) => {
  const plantContainer = document.getElementById("plantContainer");
  plantContainer.innerHTML = "";

  // Added dynamic plants
  plants.forEach((plant) => {
    const plantsElement = document.createElement("div");
    plantsElement.innerHTML = `
        <div
          class="card bg-[#FFFFFF] w-full sm:w-[300px] md:w-[260px] shadow-sm rounded-lg
                transition duration-300 ease-in-out hover:scale-105 mx-auto"
          onclick="getPlantsDetailById(${plant.id})"
        >
            <figure class="px-4 py-4">
                <img src=${plant.image}
                    alt="Shoes" class="rounded-xl h-[180px] w-full object-cover" />
            </figure>
            <div class="card-body items-start text-left pt-0 pb-4">
                <h2 class="card-title text-[14px] font-semibold text-[#1F2937] leading-5">${plant.name}</h2>
                <p class="text-[12px] font-normal text-[#1F2937] leading-4 mt-2 line-clamp-3">${plant.description}</p>
                <div class="card-actions w-full justify-between mt-2">
                    <div
                        class="badge badge-outline bg-[#DCFCE7] text-[#15803D] border-none rounded-[400px] text-[14px] font-medium left-1">
                        ${plant.category}
                    </div>
                    <div class="text-[14px] font-semibold text-[#1F2937] leading-5">৳${plant.price}</div>
                </div>
                <div class="card-actions w-full mt-3" onclick="addToCart(${plant.id}, '${plant.name}', ${plant.price}, event)">
                    <button
                        class="btn btn-primary w-full bg-[#15803D] hover:bg-[#FACC15] border-none shadow-none rounded-[999px]
                        text-white text-base font-medium">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
    plantContainer.append(plantsElement);
  });
  loadSpinner(false);
};

const displayModal = (plantDetails) => {
    const modal = document.getElementById("my_modal");
    modal.showModal();
    modal.innerHTML = "";
    const modalElement = document.createElement("div");
    modalElement.innerHTML = `
        <div class="modal-box">
            <h3 class="text-lg font-bold">${plantDetails.name}</h3>
            <figure class="px-1 py-2">
                <img src=${plantDetails.image}
                    alt="Shoes" class="rounded-xl h-[200px] w-full object-cover" />
            </figure>
            <div class="card-actions w-full justify-between mt-3">
                <div
                    class="badge badge-outline bg-[#DCFCE7] text-[#15803D] border-none rounded-[400px] text-[14px] font-medium left-1">
                    ${plantDetails.category}
                </div>
                <div class="text-[14px] font-semibold text-[#1F2937] leading-5"><span class="font-bold">Price:</span> ৳${plantDetails.price}</div>
            </div>
            <p class="py-2 text-[14px] mt-2"><span class="font-bold">Description:</span> ${plantDetails.description}</p>
            <div class="modal-action">
                <form method="dialog" class="!flex !justify-between !items-center w-full">
                    <!-- if there is a button in form, it will close the modal -->
                    <button class="btn hover:bg-red-600 hover:text-white rounded-[999px]">Close</button>
                    <button
                        onclick="addToCart(${plantDetails.id}, '${plantDetails.name}', ${plantDetails.price}, event)"
                        class="btn btn-primary bg-[#15803D] hover:bg-[#FACC15] border-none shadow-none rounded-[999px]
                        text-white text-base font-medium">
                        Add to Cart
                    </button>
                </form>
            </div>
        </div>
    `;
  modal.append(modalElement);
};

loadAllCategories();
getAllPlants();
