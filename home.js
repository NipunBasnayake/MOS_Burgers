// ----------------- Arrays -----------------

let burgersArray = [];
let beveragesArray = [];
let dessertsArray = [];



itemsList.forEach(element => {
    if (element.type == "Burger") {
        burgersArray.push(element);
    } else if (element.type == "Beverage") {
        beveragesArray.push(element);
    } else if (element.type == "Dessert") {
        dessertsArray.push(element);
    }
});


// ----------------- Sorting Buttons -----------------

let allItems = ``;
let scrollableDiv = document.getElementById("scrollableDiv");

function loadAllItems() {
    allItems = '';

    itemsList.forEach((element, index) => {
        allItems += `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4" onclick="addToOrder(${index})">
                <div class="card">
                    <img src="images/itemImages/${element.image}" class="card-img-top" alt="Item Image">
                    <div class="card-body">
                        <h5 class="card-title" id="itemName-${index}">${element.itemName}</h5>
                        <p class="card-text" id="itemPrice-${index}">LKR ${element.price}</p>
                    </div>
                </div>
            </div>`;
    });
    scrollableDiv.innerHTML = allItems;
}

function loadBurgers() {
    allItems = '';

    burgersArray.forEach((element, index) => {
        allItems += `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4" onclick="addToOrder(${index})">
                <div class="card">
                    <img src="images/itemImages/${element.image}" class="card-img-top" alt="Item Image">
                    <div class="card-body">
                        <h5 class="card-title" id="itemName-${index}">${element.itemName}</h5>
                        <p class="card-text" id="itemPrice-${index}">LKR ${element.price}</p>
                    </div>
                </div>
            </div>`;
    });
    scrollableDiv.innerHTML = allItems;
}

function loadBeverages() {
    allItems = '';

    beveragesArray.forEach((element, index) => {
        allItems += `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4" onclick="addToOrder(${index})">
                <div class="card">
                    <img src="images/itemImages/${element.image}" class="card-img-top" alt="Item Image">
                    <div class="card-body">
                        <h5 class="card-title" id="itemName-${index}">${element.itemName}</h5>
                        <p class="card-text" id="itemPrice-${index}">LKR ${element.price}</p>
                    </div>
                </div>
            </div>`;
    });
    scrollableDiv.innerHTML = allItems;
}

function loadDesserts() {
    allItems = '';

    dessertsArray.forEach((element, index) => {
        allItems += `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4" onclick="addToOrder(${index})">
                <div class="card">
                    <img src="images/itemImages/${element.image}" class="card-img-top" alt="Item Image">
                    <div class="card-body">
                        <h5 class="card-title" id="itemName-${index}">${element.itemName}</h5>
                        <p class="card-text" id="itemPrice-${index}">LKR ${element.price}</p>
                    </div>
                </div>
            </div>`;
    });
    scrollableDiv.innerHTML = allItems;
}

loadAllItems();


// ----------------- Add To Order -----------------

let ordersArray = [];
let ordersFlow = document.getElementById("ordersFlow");

function addToOrder(index) {
    Swal.fire({
        title: "Enter Quantity",
        input: "number",
        inputAttributes: {
            min: 1,
            value: 1
        },
        showCancelButton: true,
        confirmButtonText: "Add Order",
        cancelButtonText: "Cancel",
        customClass: {
            popup: 'custom-swal',
            confirmButton: 'custom-btn',
            cancelButton: 'custom-cancel-btn'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const quantity = parseInt(result.value);

            if (quantity >= 1) {
                let name = document.getElementById(`itemName-${index}`).innerText;
                itemsList.forEach(element => {
                    if (name === element.itemName && !ordersArray.some(order => order.id === element.id)) {
                        element.qty = quantity;
                        ordersArray.push(element);
                    }
                });
                renderOrders();
                getTotal();
            } else {
                Swal.fire({
                    title: "Invalid Quantity",
                    text: "Please enter a valid quantity (1 or greater).",
                    icon: "error",
                    customClass: {
                        popup: 'custom-swal',
                        confirmButton: 'custom-btn',
                        cancelButton: 'custom-cancel-btn'
                    }
                });
            }
        }
    });
}


function removeOrder(id) {
    ordersArray = ordersArray.filter(order => order.id !== id);
    renderOrders();
    getTotal();
}

function renderOrders() {
    let orderBody = ``;

    ordersArray.forEach((element) => {
        let orderPrice = element.qty * element.price;
        orderBody += `
            <div class="order-item" id="order-item-${element.id}">
                <p class="item-name">${element.itemName}</p> <p>|</p>
                <p class="item-qty">${element.qty}</p> <p>|</p>
                <p class="price highlighted">LKR ${orderPrice}</p> <p>|</p>
                <button class="btn-close" aria-label="Close" onclick="removeOrder(${element.id})"></button>
            </div>
        `;
    });
    ordersFlow.innerHTML = orderBody;
}

// ----------------- Calculate Total and Discount -----------------

let totalAmount = 0;

function getTotal() {
    totalAmount = 0;
    ordersArray.forEach(element => {
        totalAmount += (element.price * element.qty);
    });

    let discountPercentageInput = document.getElementById("txtDiscountRatio").value;
    let discountPercentage = parseFloat(discountPercentageInput);

    if (isNaN(discountPercentage) || discountPercentage < 0) {
        discountPercentage = 0;
    }

    let discount = (totalAmount * discountPercentage) / 100;
    let finalAmount = totalAmount - discount;

    let totalPrice = document.getElementById("totalPrice");
    let discountPrice = document.getElementById("discountPrice");
    let finalPriceElement = document.getElementById("finalPrice");

    totalPrice.innerHTML = `LKR ${totalAmount.toFixed(2)}`;
    discountPrice.innerHTML = `LKR ${discount.toFixed(2)}`;
    finalPriceElement.innerHTML = `LKR ${finalAmount.toFixed(2)}`;
}

getTotal();
document.getElementById("txtDiscountRatio").addEventListener("input", getTotal);


// ------------------------  Store Management -------------------------- 

function storeManagement(){

}


// ------------------------  Add Items --------------------------

// function addItem(){
//     Swal.fire({
//         title: "Add Item",
//         html: `
//                 <input type="text" id="txtAddItemId" class="swal2-input" placeholder="Enter Id" required>
//                 <input type="text" id="txtAddItemName" class="swal2-input" placeholder="Enter item name" required>
//                 <select id="itemCategory" class="swal2-input">
//                     <option value="Burger">Burger</option>
//                     <option value="Beverage">Beverage</option>
//                     <option value="Dessert">Dessert</option>
//                 </select>
//                 <input type="number" id="txtQty" class="swal2-input" placeholder="Enter Quantity" required>
//                 <input type="number" id="unitPrice" class="swal2-input" placeholder="Enter unit price" required>
//                 <input type="date" id="expireDate" class="swal2-input" placeholder="ExpireDate" required>
//             `,
//         showCancelButton: true,
//         confirmButtonText: "Add Item",
//         cancelButtonText: "Cancel",
//         preConfirm: () => {
//             let itemId = document.getElementById("txtAddItemId").value
//             let itemName = document.getElementById("txtAddItemName").value;
//             let category = document.getElementById("itemCategory").value;
//             let quantity = parseInt(document.getElementById("txtQty").value);
//             let unitPrice = parseFloat(document.getElementById("unitPrice").value);
//             let expireDate = document.getElementById("expireDate").value;
    
//             if (!itemId) {
//                 Swal.showValidationMessage("Item id cannot be empty.");
//                 return false;
//             }
//             if (!itemName) {
//                 Swal.showValidationMessage("Item name cannot be empty.");
//                 return false;
//             }
//             if (isNaN(unitPrice) || unitPrice <= 0) {
//                 Swal.showValidationMessage("Please enter a valid unit price greater than 0.");
//                 return false;
//             }
//             if (isNaN(quantity) || quantity < 1) {
//                 Swal.showValidationMessage("Please enter a valid quantity (1 or greater).");
//                 return false;
//             }
//             if (isNaN(expireDate) || expireDate < 1) {
//                 Swal.showValidationMessage("Please enter a valid Expire Date.");
//                 return false;
//             }
    
//             return { itemName, category, unitPrice, quantity };
//         },
//         customClass: {
//             popup: 'custom-swal',
//             confirmButton: 'custom-btn',
//             cancelButton: 'custom-cancel-btn'
//         }
//     }).then((result) => {
//         if (result.isConfirmed) {
//             const { itemName, category, unitPrice, quantity } = result.value;
    
//             const newItem = { 
//                 itemName, 
//                 category, 
//                 unitPrice, 
//                 quantity 
//             };
            
//             itemsList.push(newItem);
            
//             console.log("Added Item:", newItem);
//             renderOrders();
//             getTotal();
//         }
//     });
    

    
// }



// ------------------------ Temporary Methods ------------------------

function confirmOrder() {
    Swal.fire({
        title: "Order Placed",
        text: "Press OK to place next order",
        icon: "info",
        customClass: {
            popup: 'custom-swal',
            confirmButton: 'custom-btn',
            cancelButton: 'custom-cancel-btn'
        }
    });
}

function searchOrder() {
    Swal.fire({
        title: "Search Order page still not developed",
        text: "Press OK to go back",
        icon: "error",
        customClass: {
            popup: 'custom-swal',
            confirmButton: 'custom-btn',
            cancelButton: 'custom-cancel-btn'
        }
    });
}

function updateOrder() {
    Swal.fire({
        title: "Update Order page still not developed",
        text: "Press OK to go back",
        icon: "error",
        customClass: {
            popup: 'custom-swal',
            confirmButton: 'custom-btn',
            cancelButton: 'custom-cancel-btn'
        }
    });
}

function userDetails() {
    Swal.fire({
        title: "User Details page still not developed",
        text: "Press OK to go back",
        icon: "error",
        customClass: {
            popup: 'custom-swal',
            confirmButton: 'custom-btn',
            cancelButton: 'custom-cancel-btn'
        }
    });
}

