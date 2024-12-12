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




// ------------------------ Place Order Methods ------------------------

function confirmOrder() {
    // Get selected customer
    let cmbCustomer = document.getElementById("cmbCustomer").value;

    // Get items from the orders array
    let items = ordersArray.map((element) => element.itemName || "Unknown Item").join(", ");

    // Get amounts and discount
    let totalAmount = document.getElementById("totalPrice").value || "N/A";
    let discount = document.getElementById("txtDiscountRatio").value || "N/A";
    let amount = document.getElementById("finalPrice").value || "N/A";

    // Configure SweetAlert with Bootstrap Buttons
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-primary"
        },
        buttonsStyling: false
    });

    // Show the confirmation dialog
    swalWithBootstrapButtons.fire({
        title: "Order Placed..! 🎉",
        html: `
            <div style="text-align: left;">
                <p><strong>Customer:</strong> ${cmbCustomer || "N/A"}</p>
                <p><strong>Items:</strong> ${items || "No items added"}</p>
                <p><strong>Total Amount:</strong> ${totalAmount}</p>
                <p><strong>Discount:</strong> ${discount}</p>
                <p><strong>Amount:</strong> ${amount}</p>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Print Bill",
        cancelButtonText: "Cancel",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            swalWithBootstrapButtons.fire({
                title: "Order Confirmed! ✅",
                text: "The order has been successfully placed.",
                icon: "success"
            });

            // Add logic to print the bill or redirect to another page here
        }
    });
}


// ------------------------ Temporary Methods ------------------------


function searchItem() {
    let txtSearchBar = document.getElementById("txtSearchBar").value.toLowerCase();
    let scrollableDiv = document.getElementById("scrollableDiv");

    scrollableDiv.innerHTML = "";
    let foundItems = 0; 

    itemsList.forEach((element, index) => {
        if (element.itemName.toLowerCase().includes(txtSearchBar)) {
            scrollableDiv.innerHTML += `
            <div class=" mb-4" onclick="addToOrder(${index})">
                <div class="card">
                    <img src="images/itemImages/${element.image}" class="card-img-top" alt="Item Image">
                    <div class="card-body">
                        <h5 class="card-title" id="itemName-${index}">${element.itemName}</h5>
                        <p class="card-text" id="itemPrice-${index}">LKR ${element.price}</p>
                    </div>
                </div>
            </div>`;
            foundItems++;
        }
    });

    if (foundItems === 0) {
        scrollableDiv.innerHTML = `
        <div class="col-12">
            <p class="text-center">No items match your search.</p>
        </div>`;
    }
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


// -------------------------- Add Customer --------------------------

let customersArray = [];
let cmbCustomer = document.getElementById("cmbCustomer");
let customersCombobox = `<option value="" disabled selected>Select Customer</option>`;

function loadCustomerArray() {
    customersCombobox = `<option value="" disabled selected>Select Customer</option>`;
    customersArray.forEach(element => {
        customersCombobox += `
            <option value="${element.name}">${element.name}</option>
        `;
    });
    cmbCustomer.innerHTML = customersCombobox;
}
loadCustomerArray();

function addCustomer() {
    Swal.fire({
        title: `Add Customer`,
        html: `
            <input type="text" id="addCustomerName" class="swal2-input" placeholder="Customer Name">
            <input type="text" id="addMobileNumber" class="swal2-input" placeholder="Mobile Number">
        `,
        showCancelButton: true,
        confirmButtonText: "Add Customer",
        preConfirm: () => {
            let addCustomerName = document.getElementById("addCustomerName").value;
            let addMobileNumber = document.getElementById("addMobileNumber").value;

            if (!addCustomerName.trim() || !addMobileNumber.trim()) {
                Swal.fire("Error!", "All fields are required, and values must be valid.", "error");
                return false; 
            }

            customersArray.push({
                name: addCustomerName,
                mobileNumber: addMobileNumber
            });
            loadCustomerArray();
            Swal.fire("Success!", "Customer has been added.", "success");
        }
    });

}
