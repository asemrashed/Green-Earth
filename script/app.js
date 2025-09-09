const baseUrl = 'https://openapi.programming-hero.com/api'

// Loading handling
const loadDiv = document.getElementById('loading')
const content = document.getElementById('content')
// let loading = true;
const loadHandling = (status) => {
    if (status === true) {
        content.classList.add('hidden')
        loadDiv.classList.remove('hidden')
        loadDiv.className = 'flex items-center justify-center h-[30dvh]'
    } else {
        loadDiv.classList.add('hidden')
        content.classList.remove('hidden')
        content.className = 'flex gap-5 flex-col md:flex-row'
    }
}
// Categories section
async function loadCategories() {
    try {
        loadHandling(true)
        const res = await fetch(`${baseUrl}/categories`);
        const categories = await res.json();
        displayCategories(categories.categories)
    } catch (err){
        console.log(err, 'Unable to fetch data form api')
     }
}
loadCategories()
function removeActive() {
    const allCat = document.querySelectorAll('.cat-btn')
    allCat.forEach(cat => cat.classList.remove('active'))
}
const displayCategories = (categories) => {
    const categoryContainer = document.getElementById('category-container')
    // categoryContainer.innerHTML = ""
        const categoryAll = document.createElement('li')
        categoryAll.innerHTML = `
            <li onclick="loadTrees('0')" id="tree0" class="cat-btn active cursor-pointer text-[#1F2937] hover:text-white hover:bg-[#15803D] px-2 py-1 rounded">All Trees</li>
        `
        categoryContainer.appendChild(categoryAll)
        loadTrees('0')
    for (let category of categories){
        const categoryLi = document.createElement('li')
        categoryLi.innerHTML = `
            <li onclick="loadTrees(${category.id})" id="tree${category.id}" class="cat-btn text-[#1F2937] cursor-pointer mt-1 hover:text-white hover:bg-[#15803D] px-2 py-1 rounded">${category.category_name}</li>
        `
        categoryContainer.appendChild(categoryLi)
    };
}

// tree display section
async function loadTrees(treeId) {
    const treeCat = document.getElementById(`tree${treeId}`)
    removeActive()
    treeCat.classList.add('active')
    if (treeId !== '0') {
        try {
            const trees = await fetch(`${baseUrl}/category/${treeId}`)
            const res = await trees.json();
            displayTrees(res.plants)
        } catch (err) {
            console.log(err, 'api not fatched')
        }
    } else {
         try {
            const trees = await fetch(`${baseUrl}/plants`)
            const res = await trees.json();
            displayTrees(res.plants)
        } catch (err) {
            console.log(err, 'api not fatched')
        }
    }
} 
const displayTrees = (trees) => {
    const treesContainer = document.getElementById('trees-container')
    treesContainer.innerHTML= ""
    for (let tree of trees) {
        const treeCard = document.createElement('div')
        treeCard.innerHTML = `
            <div class="flex flex-col bg-white p-4 rounded-lg gap-2 h-96 justify-between">
                <div class="rounded-md h-[185px] overflow-hidden">
                    <img src="${tree.image}" alt="${tree.name}" class="w-full h-full object-cover">
                </div>
                <h3 id="modal-btn${tree.id}" onclick="displayModal('${tree.id}','${tree.image}','${tree.name}','${tree.description}','${tree.category}','${tree.price}')" class="cursor-pointer text-sm font-bold">${tree.name}</h3>
                <p class="text-xs">${tree.description}</p>
                <div class="flex justify-between">
                    <div class="px-2 py-1 bg-[#DCFCE7] rounded-lg text-[#15803D] text-sm">${tree.category}</div>
                    <div class="text-sm font-semibold">৳${tree.price}</div>
                </div>
                <button onclick="displayCart('${tree.id}','${tree.name}', '${tree.price}')" class="btn w-full bg-[#15803D] hover:bg-[#0e5226] text-white rounded-full">Add to Cart</button>
            </div>
        `
        treesContainer.appendChild(treeCard)
        loadHandling(false)
    }
}
// Modal
const displayModal = (id, link, name, des, category, price) => {
    const modalContainer = document.getElementById('modalContainer')
    modalContainer.innerHTML = "";
    const modalDiv = document.createElement('div')
    modalDiv.innerHTML = `
        <!-- Open the modal using ID.showModal() method -->
        <dialog id="my_modal_5" class="modal modal-bottom sm:modal-middle">
            <div class="modal-box flex flex-col bg-white p-3 md:p-5 rounded-lg gap-2 justify-between">
                <div class="rounded-md h-70 overflow-hidden">
                    <img src="${link}" alt="${name}" class="w-full h-full object-cover">
                </div>
                <h3 class="cursor-pointer text-md font-bold">${name}</h3>
                <p class="text-sm">${des}</p>
                <div class="flex justify-between">
                    <div class="px-2 py-1 bg-[#DCFCE7] rounded-lg text-[#15803D] text-md">${category}</div>
                    <div class="text-md font-semibold">৳${price}</div>
                </div>
                <form method="dialog" class="modal-backdrop">
                    <button onclick="displayCart('${id}','${name}', '${price}')" class="btn w-full bg-[#15803D] hover:bg-[#0e5226] text-white rounded-full">Add to Cart</button>
                </form>
            </div>
        </dialog>
    `
    modalContainer.appendChild(modalDiv)
    document.getElementById('my_modal_5').showModal()
}
// cart section
let totalPrice = 0;
const total = document.getElementById('total')
const displayCart = (id, name, price) => {
    const uniqueId = `${id}-${Date.now()}`;
    const cartContainer = document.getElementById('cart-container')
    const cartDiv = document.createElement('div') // I'm pointing this div. its not deleting,
    cartDiv.innerHTML = `
        <div id="${uniqueId}" class="flex flex-col">
          <div class="flex items-center justify-between px-3 py-2 bg-[#F0FDF4] rounded-md">
            <div class="flex flex-col gap-2">
              <p class="text-sm text-[#1F2937] font-semibold">${name}</p>
              <p class="text-sm text-[#1F2937]/60">৳${price}</p>
            </div>
            <button onclick="deleteCart('${uniqueId}', '${price}', '${name}')" class="btn border-none text-[#333]/60 hover:text-gray-800 bg-[#F0FDF4]"><i class="fa-solid fa-xmark"></i></button>
          </div>
        </div>
    `
    cartContainer.appendChild(cartDiv)
    totalPrice += parseInt(price);
    total.innerText = `৳${totalPrice}`
}
function deleteCart (id, price, name){
    // if (price < totalPrice) {
        console.log(name, 'is deleted')
        totalPrice -= price
        const cart = document.getElementById(`${id}`)
        cart.parentElement.remove();
        total.innerText = `৳${totalPrice}`
    // }
}