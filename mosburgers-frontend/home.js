// ----------------- User Role -----------------
function loadUserRole() {
    const currentUserString = localStorage.getItem('currentUser');
    
    if (currentUserString) {
        try {
            const currentUser = JSON.parse(currentUserString);
            const userButtonText = currentUser.name + " - " + (currentUser.role === 'admin' ? 'Admin' : 'Cashier');
            document.getElementById('userRoleDisplay').textContent = userButtonText;
        } catch (error) {
            document.getElementById('userRoleDisplay').textContent = "Cashier";
        }
    } else {
        document.getElementById('userRoleDisplay').textContent = "Cashier";
    }
}

function confirmLogout() {
    Swal.fire({
        title: 'Are you sure you want to logout?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, logout!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            window.location.href = 'index.html';
        }
    });
}

// ----------------- Arrays -----------------
let itemsList = [];
let burgersArray = [];
let beveragesArray = [];
let dessertsArray = [];

// ----------------- Load data from DB -----------------
function loadItemsFromDB() {
    loadLastOrderId();

    fetch("http://localhost:8080/item/all")
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
        if (element.type === "Burger") burgersArray.push(element);
        else if (element.type === "Beverage") beveragesArray.push(element);
        else if (element.type === "Dessert") dessertsArray.push(element);
    });
}

// ----------------- Sorting Buttons -----------------
let items = ``;
let scrollableDiv = document.getElementById("scrollableDiv");

function loadAllItems() {
    items = '';
    itemsList.forEach((element) => {
        items += `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4" onclick="addToOrder(${element.id})">
                <div class="card">
                    <img src="images/itemImages/${element.image}" class="card-img-top" alt="Item Image">
                    <div class="card-body">
                        <h5 class="card-title">${element.name} - ${element.quantity}</h5>
                        <p class="card-text">LKR ${element.price}</p>
                    </div>
                </div>
            </div>`;
    });
    scrollableDiv.innerHTML = items;
}

function loadBurgers() {
    items = '';
    burgersArray.forEach((element) => {
        items += `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4" onclick="addToOrder(${element.id})">
                <div class="card">
                    <img src="images/itemImages/${element.image}" class="card-img-top" alt="Item Image">
                    <div class="card-body">
                        <h5 class="card-title">${element.name} - ${element.quantity}</h5>
                        <p class="card-text">LKR ${element.price}</p>
                    </div>
                </div>
            </div>`;
    });
    scrollableDiv.innerHTML = items;
}

function loadBeverages() {
    items = '';
    beveragesArray.forEach((element) => {
        items += `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4" onclick="addToOrder(${element.id})">
                <div class="card">
                    <img src="images/itemImages/${element.image}" class="card-img-top" alt="Item Image">
                    <div class="card-body">
                        <h5 class="card-title">${element.name} - ${element.quantity}</h5>
                        <p class="card-text">LKR ${element.price}</p>
                    </div>
                </div>
            </div>`;
    });
    scrollableDiv.innerHTML = items;
}

function loadDesserts() {
    items = '';
    dessertsArray.forEach((element) => {
        items += `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4" onclick="addToOrder(${element.id})">
                <div class="card">
                    <img src="images/itemImages/${element.image}" class="card-img-top" alt="Item Image">
                    <div class="card-body">
                        <h5 class="card-title">${element.name} - ${element.quantity}</h5>
                        <p class="card-text">LKR ${element.price}</p>
                    </div>
                </div>
            </div>`;
    });
    scrollableDiv.innerHTML = items;
}

loadItemsFromDB();
loadUserRole();

// ----------------- Add To Order -----------------
let ordersArray = [];
let ordersFlow = document.getElementById("ordersFlow");

function addToOrder(index) {
    let item = itemsList.find(item => item.id === index);
    if (item) {
        let order = ordersArray.find(order => order.id === index);
        if (order) order.qty++;
        else ordersArray.push({ ...item, qty: 1 });
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
            <div class="order-item d-flex align-items-center border-1 border-primary justify-content-between py-2">
                <span class="item-name flex-grow-1">${element.name}</span>
                <div class="item-qty-controls d-flex align-items-center mx-3">
                    <button class="btn btn-sm btn-outline-primary" onclick="decrementQty(${element.id})">-</button>
                    <span class="item-qty mx-2">${element.qty}</span>
                    <button class="btn btn-sm btn-outline-primary" onclick="incrementQty(${element.id})">+</button>
                </div>
                <span class="price highlighted mx-3">LKR ${orderPrice}</span>
                <button class="btn btn-close" aria-label="Close" onclick="removeOrder(${element.id})"></button>
            </div>`;
    });
    ordersFlow.innerHTML = orderBody;
}

// ----------------- Calculate Total and Discount -----------------
let totalAmount = 0;
let finalAmount = 0;

function getTotal() {
    totalAmount = ordersArray.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let discountPercentage = parseFloat(document.getElementById("txtDiscountRatio").value) || 0;
    let discount = (totalAmount * discountPercentage) / 100;
    finalAmount = totalAmount - discount;

    document.getElementById("totalPrice").innerHTML = `LKR ${totalAmount.toFixed(2)}`;
    document.getElementById("discountPrice").innerHTML = `LKR ${discount.toFixed(2)}`;
    document.getElementById("finalPrice").innerHTML = `LKR ${finalAmount.toFixed(2)}`;
}

getTotal();
document.getElementById("txtDiscountRatio").addEventListener("input", getTotal);

// ------------------------ Place Order Methods ------------------------
function confirmOrder() {
    let today = new Date().toISOString().split('T')[0];
    let cmbCustomer = document.getElementById("cmbCustomer").value;
    let customerId = customersArray.find(c => c.name === cmbCustomer)?.id;
    let discount = parseFloat(document.getElementById("txtDiscountRatio").value) || 0;
    let totalAmount = ordersArray.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let finalAmount = totalAmount - (totalAmount * discount / 100);

    let orderDetails = ordersArray.map(element => ({
        "orderId": 1,
        "itemId": element.id,
        "quantity": element.qty,
        "unitPrice": element.price
    }));

    fetch("http://localhost:8080/home/addOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "date": today,
            "customerId": customerId,
            "discountRate": discount,
            "totalPrice": finalAmount,
            "details": orderDetails
        })
    })
    .then(response => response.text())
    .then(() => showOrderConfirmation(cmbCustomer, ordersArray, discount, totalAmount, finalAmount))
    .catch(error => {
        console.error("Error placing order:", error);
        Swal.fire("Order Failed!", "Something went wrong while placing the order.", "error");
    });
}

// ------------------------ Order Confirmation & PDF ------------------------
function showOrderConfirmation(cmbCustomer, ordersArray, discount, totalAmount, finalAmount) {
    Swal.fire({
        title: "Order Placed!",
        html: `
            <div style="text-align: left;">
                <p><strong>Customer:</strong> ${cmbCustomer || "N/A"}</p>
                <table style="width: 100%; margin-top: 10px;">
                    <thead>
                        <tr style="border-bottom: 2px solid #ddd;">
                            <th style="text-align: left; padding: 8px;">Item</th>
                            <th style="text-align: left; padding: 8px;">Price</th>
                            <th style="text-align: left; padding: 8px;">Qty</th>
                            <th style="text-align: left; padding: 8px;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${ordersArray.map(item => `
                            <tr style="border-bottom: 1px solid #ddd;">
                                <td style="padding: 8px;">${item.name}</td>
                                <td style="padding: 8px;">${item.price.toFixed(2)}</td>
                                <td style="padding: 8px;">${item.qty}</td>
                                <td style="padding: 8px;">${(item.price * item.qty).toFixed(2)}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
                <p style="margin-top: 10px;">
                    <strong>Total Amount:</strong> LKR ${totalAmount.toFixed(2)}
                </p>
                <p><strong>Discount:</strong> ${discount.toFixed(2)}%</p>
                <p><strong>Final Amount:</strong> LKR ${finalAmount.toFixed(2)}</p>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Print Bill",
        cancelButtonText: "Cancel"
    }).then((result) => {
        if (result.isConfirmed) {
            generateInvoicePDF(cmbCustomer, ordersArray, discount, totalAmount, finalAmount);
            clearOrder();
        }
    });
}

function clearOrder() {
    ordersArray = [];
    renderOrders();
    getTotal();
    loadLastOrderId();
}

function generateInvoicePDF(cmbCustomer, ordersArray, discount, totalAmount, finalAmount) {
    const doc = new jsPDF();
    doc.setFont("helvetica");
    doc.setFontSize(28);
    doc.text("MOS BURGERS", 105, 20, null, null, "center");
    doc.setFontSize(18);
    doc.text("INVOICE", 105, 30, null, null, "center");
    doc.setFontSize(11);
    doc.text(`Customer: ${cmbCustomer || "N/A"}`, 20, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 45);
    
    doc.setFontSize(11);
    doc.setFont("", "bold");
    doc.rect(20, 53, 108, 7);
    doc.text("Item", 25, 58);
    doc.text("Price", 70, 58);
    doc.text("Qty", 93, 58);
    doc.text("Amount", 110, 58);

    doc.setFont("", "regular");
    let yPosition = 60;
    ordersArray.forEach((element) => {
        yPosition += 7;
        doc.rect(20, yPosition, 108, 7);
        doc.text(element.name.substring(0, 30), 25, yPosition + 5);
        doc.text(element.price.toFixed(2), 70, yPosition + 5);
        doc.text(element.qty.toString(), 95, yPosition + 5);
        doc.text((element.qty * element.price).toFixed(2), 110, yPosition + 5);
    });
    
    yPosition += 17;
    doc.text(`Total Amount: LKR ${totalAmount.toFixed(2)}`, 20, yPosition);
    doc.text(`Discount Rate: ${discount.toFixed(2)}%`, 20, yPosition + 5);
    doc.text(`Discount Price: LKR ${(totalAmount * discount / 100).toFixed(2)}`, 20, yPosition + 10);
    doc.text(`Final Amount: LKR ${finalAmount.toFixed(2)}`, 20, yPosition + 15);
    doc.setFontSize(12);
    doc.text("Thank you for your purchase!", 105, yPosition + 25, null, null, "center");

    doc.save("Order_Bill.pdf");
}

// ----------------- User Management -----------------
function userDetails() {
    const currentUserString = localStorage.getItem('currentUser');
    if (!currentUserString) {
        Swal.fire("Error", "User data not found", "error");
        return;
    }

    const currentUser = JSON.parse(currentUserString);
    const isAdmin = currentUser.role === 'admin';

    let htmlContent = `
        <div class="user-details-container" style="text-align: left;">
            <div class="mb-3 d-flex">
                <label style="font-weight: bold; min-width: 70px;">Name :</label>
                <span>${currentUser.name || ''}</span>
            </div>
            <div class="mb-3 d-flex">
                <label style="font-weight: bold; min-width: 70px;">Email :</label>
                <span>${currentUser.email || ''}</span>
            </div>
            <div class="mb-3 d-flex">
                <label style="font-weight: bold; min-width: 70px;">Role :</label>
                <span>${currentUser.role || 'Cashier'}</span>
            </div>
    `;

    if (isAdmin) {
        htmlContent += `
            <hr>
            <button id="addUserBtn" class="btn btn-primary w-100 mt-2">
                <i class="bi bi-person-plus"></i> Add New User
            </button>
        `;
    }

    htmlContent += `</div>`;

    const swalInstance = Swal.fire({
        title: "User Details",
        html: htmlContent,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonText: "Close",
        didOpen: () => {
            const addUserBtn = document.getElementById('addUserBtn');
            if (addUserBtn) {
                addUserBtn.addEventListener('click', () => {
                    swalInstance.close();
                    showAddUserForm();
                });
            }
        }
    });
}

function showAddUserForm() {
    Swal.fire({
        title: "Add New User",
        html: `
            <div class="mb-3">
                <input type="text" id="newUserName" class="form-control" placeholder="Full Name" required>
            </div>
            <div class="mb-3">
                <input type="email" id="newUserEmail" class="form-control" placeholder="Email" required>
            </div>
            <div class="mb-3">
                <input type="password" id="newUserPassword" class="form-control" placeholder="Password" required>
            </div>
            <div class="mb-3">
                <select id="newUserRole" class="form-control">
                    <option value="cashier">Cashier</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Add User",
        preConfirm: () => {
            const newUser = {
                name: document.getElementById('newUserName').value.trim(),
                email: document.getElementById('newUserEmail').value.trim(),
                password: document.getElementById('newUserPassword').value.trim(),
                role: document.getElementById('newUserRole').value
            };

            if (!newUser.name || !newUser.email || !newUser.password) {
                Swal.showValidationMessage("Please fill all fields");
                return false;
            }

            return fetch("http://localhost:8080/user/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser)
            })
            .then(response => {
                if (!response.ok) throw new Error("Failed to add user");
                return response.text();
            })
            .catch(error => {
                Swal.showValidationMessage(error.message);
                return false;
            });
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire("Success!", "User added successfully", "success");
        }
    });
}

// ----------------- Customer Management -----------------
let customersArray = [];

function loadCustomersFromDB() {
    fetch("http://localhost:8080/customer/all")
        .then((response) => response.json())
        .then((result) => {
            customersArray = result;
            loadCustomerComboBox();
        })
        .catch((error) => console.error("Error loading customers:", error));
}

function loadCustomerComboBox() {
    let cmbCustomer = document.getElementById("cmbCustomer");
    cmbCustomer.innerHTML = `<option value="" disabled selected>Select Customer</option>` + 
        customersArray.map(c => `<option value="${c.name}">${c.name}</option>`).join("");
}

function addCustomer() {
    Swal.fire({
        title: "Add Customer",
        html: `
            <input type="text" id="addCustomerName" class="swal2-input" placeholder="Customer Name">
            <input type="text" id="addMobileNumber" class="swal2-input" placeholder="Mobile Number">
        `,
        showCancelButton: true,
        confirmButtonText: "Add Customer",
        preConfirm: () => {
            const customer = {
                name: document.getElementById("addCustomerName").value.trim(),
                mobile: document.getElementById("addMobileNumber").value.trim()
            };

            if (!customer.name || !customer.mobile) {
                Swal.fire("Error!", "All fields are required", "error");
                return false;
            }

            return fetch("http://localhost:8080/customer/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(customer)
            })
            .then(response => response.text())
            .then(() => loadCustomersFromDB())
            .catch(error => {
                Swal.fire("Error!", "Failed to add customer", "error");
                return false;
            });
        }
    });
}

// ----------------- Utilities -----------------
function loadDateTime() {
    const lblDateAndTime = document.getElementById("lblDateAndTime");
    if (lblDateAndTime) {
        lblDateAndTime.innerHTML = new Date().toLocaleString();
    }
}

function loadLastOrderId() {
    const lblOrderId = document.getElementById("lblOrderId");
    lblOrderId.innerHTML = "Loading...";
    fetch("http://localhost:8080/home/lastOrderId")
        .then((response) => response.json())
        .then((result) => {
            lblOrderId.innerHTML = result+1;
        });
}

loadCustomersFromDB();
loadDateTime();
setInterval(loadDateTime, 1000);