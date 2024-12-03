// ----------------- Quantity Increment / Decrement -----------------

let x = 1;
function button1() {
    document.getElementById('output-area').value = ++x;
}
function button2() {
    if (x > 1) {
        document.getElementById('output-area').value = --x;
    }
}


// ----------------- Arrays -----------------

let burgersArray = [];
let beveragesArray = [];
let dessertsArray = [];

itemsList.forEach(element => {
    if(element.type == "Burger"){
        burgersArray.push(element);
    }else if (element.type == "Beverage") {
        beveragesArray.push(element);
    }else if (element.type == "Dessert") {
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
            <div class="col-lg-3 col-md-4 col-sm-6 mb-3" onclick="addToOrder(${index})">
                <div class="card">
                    <img src="images/itemImages/${element.image}" class="card-img-top" alt="Item Image">
                    <div class="card-body">
                        <h5 class="card-title" id="itemName-${index}">${element.itemName}</h5>
                        <p class="card-text" id="itemPrice-${index}">${element.price}</p>
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
            <div class="col-lg-3 col-md-4 col-sm-6 mb-3" onclick="addToOrder(${index})">
                <div class="card">
                    <img src="images/itemImages/${element.image}" class="card-img-top" alt="Item Image">
                    <div class="card-body">
                        <h5 class="card-title" id="itemName-${index}">${element.itemName}</h5>
                        <p class="card-text" id="itemPrice-${index}">${element.price}</p>
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
            <div class="col-lg-3 col-md-4 col-sm-6 mb-3" onclick="addToOrder(${index})">
                <div class="card">
                    <img src="images/itemImages/${element.image}" class="card-img-top" alt="Item Image">
                    <div class="card-body">
                        <h5 class="card-title" id="itemName-${index}">${element.itemName}</h5>
                        <p class="card-text" id="itemPrice-${index}">${element.price}</p>
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
            <div class="col-lg-3 col-md-4 col-sm-6 mb-3" onclick="addToOrder(${index})">
                <div class="card">
                    <img src="images/itemImages/${element.image}" class="card-img-top" alt="Item Image">
                    <div class="card-body">
                        <h5 class="card-title" id="itemName-${index}">${element.itemName}</h5>
                        <p class="card-text" id="itemPrice-${index}">${element.price}</p>
                    </div>
                </div>
            </div>`;
    });
    scrollableDiv.innerHTML = allItems;
}

loadAllItems();


let ordersArray = [];
let ordersFlow = document.getElementById("ordersFlow");

function addToOrder(index) {
    let name = document.getElementById(`itemName-${index}`).innerText;
    let price = document.getElementById(`itemPrice-${index}`).innerText;
    
    itemsList.forEach(element => {
        if (name == element.itemName && !ordersArray.includes(element)) {
            ordersArray.push(element);
        }
    });
    renderOrders();
}

function renderOrders() {
    let orderBody = ``;

    ordersArray.forEach((element, index) => {
    orderBody +=`
        <div class="order-item" id="order-item-${element.id}">
            <button class="btn-close" aria-label="Close" onclick="removeOrder('${element.id}')">&times;</button>
            <div class="order-item-details">
                <p class="item-name">${element.itemName}</p>
                <div class="quantity-controls">
                    <input type="button" class="quantity-btn" value="-" onclick="decreaseQuantity('${element.id}')"/>
                    <input type="text" class="output-area-${element.id}" value="1" readonly />
                    <input type="button" class="quantity-btn" value="+" onclick="increaseQuantity('${element.id}')"/>
                </div>
                <p class="price-${element.id}">${element.price}</p>
            </div>
        </div>`;
    });

    ordersFlow.innerHTML = orderBody;
}

function increaseQuantity(index) {
    let qtyField = document.getElementById(`output-area-${index}`);
    let currentQty = parseInt(qtyField.value);
    qtyField.value = currentQty + 1;
}

function decreaseQuantity(index) {
    let qtyField = document.getElementById(`output-area-${index}`);
    let currentQty = parseInt(qtyField.value);
    if (currentQty > 1) {
        qtyField.value = currentQty - 1;
    }
}

function removeOrder(index) {
    ordersArray.splice(index, 1);
    renderOrders(); 
}

