// ----------------- Arrays -----------------
let itemsList = [];
let burgersArray = [];
let beveragesArray = [];
let dessertsArray = [];

// ----------------- Load data from DB -----------------
function loadItemsFromDB() {
    fetch("http://localhost:8080/home/all")
        .then((response) => response.json())
        .then((data) => {
            itemsList = data;
            categorizeItems();
            loadAllItems();
        })
        .catch((error) => console.error("Error fetching data:", error));
}

function categorizeItems() {
    burgersArray = [];
    beveragesArray = [];
    dessertsArray = [];

    itemsList.forEach(element => {
        if (element.type === "Burger") {
            burgersArray.push(element);
        } else if (element.type === "Beverage") {
            beveragesArray.push(element);
        } else if (element.type === "Dessert") {
            dessertsArray.push(element);
        }
    });
}

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

    dessertsArray.forEach((element) => {
        allItems += `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4" onclick="addToOrder(${element.id})">
                <div class="card">
                    <img src="images/itemImages/${element.image}" class="card-img-top" alt="Item Image">
                    <div class="card-body">
                        <h5 class="card-title" id="itemName-${element.id}">${element.itemName}</h5>
                        <p class="card-text" id="itemPrice-${element.id}">LKR ${element.price}</p>
                    </div>
                </div>
            </div>`;
    });
    scrollableDiv.innerHTML = allItems;
}

loadItemsFromDB();



// ----------------- Add To Order -----------------

let ordersArray = [];
let ordersFlow = document.getElementById("ordersFlow");

function addToOrder(id) {
    let name = document.getElementById(`itemName-${id}`).innerText.trim();
    let item = itemsList.find(element => element.itemName.trim() === name);

    if (item && !ordersArray.some(order => order.id === item.id)) {
        item.qty = 1; 
        ordersArray.push(item);
        renderOrders();
        getTotal();
    }
}

function incrementQty(id) {
    let order = ordersArray.find(order => order.id === id);
    if (order) {
        order.qty++;
        renderOrders();
        getTotal();
    }
}

function decrementQty(id) {
    let order = ordersArray.find(order => order.id === id);
    if (order && order.qty > 1) {
        order.qty--;
        renderOrders();
        getTotal();
    }
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
            <div class="order-item d-flex align-items-center border-1 border-primary justify-content-between py-2" id="order-item-${element.id}">
                <span class="item-name flex-grow-1">${element.itemName}</span>
                <div class="item-qty-controls d-flex align-items-center mx-3">
                    <button class="btn btn-sm btn-outline-primary" onclick="decrementQty(${element.id})">-</button>
                    <span class="item-qty mx-2">${element.qty}</span>
                    <button class="btn btn-sm btn-outline-primary" onclick="incrementQty(${element.id})">+</button>
                </div>
                <span class="price highlighted mx-3">LKR ${orderPrice}</span>
                <button class="btn btn-close" aria-label="Close" onclick="removeOrder(${element.id})"></button>
            </div>
        `;
    });
    ordersFlow.innerHTML = orderBody;
}


// ----------------- Calculate Total and Discount -----------------

let totalAmount = 0;
let finalAmount = 0;

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
    finalAmount = totalAmount - discount;

    let totalPrice = document.getElementById("totalPrice");
    let discountPrice = document.getElementById("discountPrice");
    let finalPriceElement = document.getElementById("finalPrice");

    totalPrice.innerHTML = `LKR ${totalAmount.toFixed(2)}`;
    discountPrice.innerHTML = `LKR ${discount.toFixed(2)}`;
    finalPriceElement.innerHTML = `LKR ${finalAmount.toFixed(2)}`;
}

getTotal();
document.getElementById("txtDiscountRatio").addEventListener("input", getTotal);


// ------------------------ Place Order Methods ------------------------

function confirmOrder() {
    let cmbCustomer = document.getElementById("cmbCustomer").value;
    let items = ordersArray.map((element) => `<tr><td>${element.itemName || "Unknown Item"}</td><td class="ps-2">${element.qty || 0}</td></tr>`).join("");
    
    let discount = document.getElementById("txtDiscountRatio").value;
    discount = discount ? parseFloat(discount) : 0;  
    
    const totalAmount = ordersArray.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const finalAmount = totalAmount - (totalAmount * (discount / 100));

    const orderDetails = {
        customer: cmbCustomer,
        items: ordersArray,
        discount: discount,
        totalAmount: totalAmount,
        finalAmount: finalAmount,
        orderDate: new Date().toLocaleString()
    };

    let orderHistoryArray = JSON.parse(localStorage.getItem("orderHistory")) || [];
    orderHistoryArray.push(orderDetails);
    localStorage.setItem("orderHistory", JSON.stringify(orderHistoryArray));

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-primary"
        },
        buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
        title: "Order Placed!",
        html: `
            <div style="text-align: left; font-family: Arial, sans-serif; line-height: 1.6;">
                <p><strong>Customer:</strong> ${cmbCustomer || "N/A"}</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <thead>
                        <tr style="background-color: #f8f9fa; border-bottom: 2px solid #ddd;">
                            <th style="text-align: left; padding: 8px; font-weight: bold;">Item</th>
                            <th style="text-align: left; padding: 8px; font-weight: bold;">Price</th>
                            <th style="text-align: left; padding: 8px; font-weight: bold;">Quantity</th>
                            <th style="text-align: left; padding: 8px; font-weight: bold;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${ordersArray.map(item => `
                            <tr style="border-bottom: 1px solid #ddd;">
                                <td style="padding: 8px;">${item.itemName}</td>
                                <td style="padding: 8px;">${item.price.toFixed(2)}</td>
                                <td style="padding: 8px;">${item.qty}</td>
                                <td style="padding: 8px;">${(item.price * item.qty).toFixed(2)}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
                <p style="margin-top: 10px; font-size: 1rem;">
                    <strong>Total Amount:</strong> LKR ${totalAmount.toFixed(2)}
                </p>
                <p style="font-size: 1rem;">
                    <strong>Discount:</strong> ${discount.toFixed(2)}%
                </p>
                <p style="font-size: 1rem;">
                    <strong>Final Amount:</strong> LKR ${finalAmount.toFixed(2)}
                </p>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Print Bill",
        cancelButtonText: "Cancel",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            const doc = new jsPDF('p', 'mm', 'a5');
            doc.setFont("helvetica");

            const pageWidth = 148;
            const leftMargin = 20;
            const rightMargin = pageWidth - leftMargin;
            let yPosition = 20;

            doc.setFontSize(28);
            doc.setFont("");
            doc.text("MOS BURGERS", pageWidth / 2, yPosition, null, null, "center");
            yPosition += 10;
            doc.setFontSize(18);
            doc.text("INVOICE", pageWidth / 2, yPosition, null, null, "center");
            yPosition += 10;
            
            doc.setFontSize(11);

            doc.text(`Customer: ${cmbCustomer || "N/A"}`, leftMargin, yPosition);
            yPosition += 5;
            doc.text(`Date: ${new Date().toLocaleDateString()}`, leftMargin, yPosition);
            yPosition += 8;

            doc.setFontSize(11);
            doc.setLineWidth(0.5);
            doc.setFont("","bold");
            doc.rect(leftMargin, yPosition, 108, 7);
            doc.text("Item", leftMargin + 5, yPosition + 5);
            doc.text("Price", leftMargin + 50, yPosition + 5);
            doc.text("Qty", leftMargin + 73, yPosition + 5);
            doc.text("Amount", leftMargin + 90, yPosition + 5);

            doc.setFont("","regular");
            ordersArray.forEach((element) => {
                yPosition += 7;
                doc.rect(leftMargin, yPosition, 108, 7);
                let itemName = (element.itemName || "Unknown Item").substring(0, 30);
                doc.text(itemName, leftMargin + 5, yPosition + 5);
                doc.text(`${element.price.toFixed(2)}`, leftMargin + 50, yPosition + 5);
                doc.text(`${element.qty || 0}`, leftMargin + 75, yPosition + 5);
                doc.text(`${(element.qty*element.price).toFixed(2)}`, leftMargin + 90, yPosition + 5);
            });
            yPosition += 17;

            doc.setFontSize(11);
            doc.text(`Total Amount   : LKR ${totalAmount.toFixed(2)}`, leftMargin, yPosition);
            yPosition += 5;
            doc.text(`Discount Rate  : ${discount.toFixed(2)}%`, leftMargin, yPosition);
            yPosition += 5;
            doc.text(`Discount Price : LKR ${(totalAmount * discount / 100).toFixed(2)}`, leftMargin, yPosition);
            yPosition += 5;
            doc.text(`Final Amount   : LKR ${finalAmount.toFixed(2)}`, leftMargin, yPosition);
            yPosition += 15;
            doc.setFontSize(12);
            doc.text("Thank you for your purchase!", pageWidth / 2, yPosition, null, null, "center");

            doc.save("Order_Bill.pdf");
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

let customersArray = JSON.parse(localStorage.getItem("customers")) || []; 
let cmbCustomer = document.getElementById("cmbCustomer");
let customersCombobox = `<option value="" disabled selected>Select Customer</option>`;

function saveCustomersToLocalStorage() {
    localStorage.setItem("customers", JSON.stringify(customersArray));
}

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
            let addCustomerName = document.getElementById("addCustomerName").value.trim();
            let addMobileNumber = document.getElementById("addMobileNumber").value.trim();

            if (!addCustomerName || !addMobileNumber) {
                Swal.fire("Error!", "All fields are required, and values must be valid.", "error");
                return false;
            }

            customersArray.push({
                id: customersArray.length+1, 
                name: addCustomerName,
                mobileNumber: addMobileNumber
            });

            saveCustomersToLocalStorage();
            loadCustomerArray();

            Swal.fire("Success!", "Customer has been added.", "success");
        }
    });
}

