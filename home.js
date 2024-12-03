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


// ----------------- Add To Order -----------------

let ordersArray = [];
let ordersFlow = document.getElementById("ordersFlow");

function addToOrder(index) {
    console.log(index);

    Swal.fire({
        title: "Enter Quantity",
        input: "number",
        inputAttributes: {
          min: 1,
          value: 1
        },
        showCancelButton: true,
        confirmButtonText: "Add Order",
      }).then((result) => {
        if (result.isConfirmed) {
          const quantity = parseInt(result.value);
      
          if (quantity >= 1) {
            let name = document.getElementById(`itemName-${index}`).innerText;
            itemsList.forEach(element => {
                if (name == element.itemName && !ordersArray.some(order => order.id === element.id)) {
                    element.qty = quantity;
                    ordersArray.push(element);
                }
            });
            renderOrders();
          } else {
            Swal.fire({
              title: "Invalid Quantity",
              text: "Please enter a valid quantity (1 or greater).",
              icon: "error"
            });
          }
        }
    });
}

function removeOrder(id) {
    ordersArray = ordersArray.filter(order => order.id !== id);
    renderOrders();
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


