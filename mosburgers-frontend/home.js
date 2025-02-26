// ----------------- Arrays -----------------
let itemsList = [];
let burgersArray = [];
let beveragesArray = [];
let dessertsArray = [];
let ordersArray = [];
let customersArray = [];

// ----------------- DOM Elements -----------------
const scrollableDiv = document.getElementById("scrollableDiv");
const ordersFlow = document.getElementById("ordersFlow");
const totalPrice = document.getElementById("totalPrice");
const discountPrice = document.getElementById("discountPrice");
const finalPriceElement = document.getElementById("finalPrice");
const txtDiscountRatio = document.getElementById("txtDiscountRatio");
const cmbCustomer = document.getElementById("cmbCustomer");

// ----------------- Load Data from DB -----------------
async function loadItemsFromDB() {
    try {
        const response = await fetch("http://localhost:8080/item/all");
        if (!response.ok) throw new Error("Failed to fetch items");
        itemsList = await response.json();
        categorizeItems();
        loadAllItems();
    } catch (error) {
        console.error("Error fetching items:", error);
    }
}

function categorizeItems() {
    burgersArray = itemsList.filter(item => item.type === "Burger");
    beveragesArray = itemsList.filter(item => item.type === "Beverage");
    dessertsArray = itemsList.filter(item => item.type === "Dessert");
}

function loadOrderID() {
    fetch("http://localhost:8080/home/lastOrderId")
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then((result) => {
            const lastOrderId = parseInt(result, 10);
            if (!isNaN(lastOrderId)) {
                let orderIdLable = document.getElementById("lblOrderId");
                orderIdLable.textContent = `Order ID: ${lastOrderId + 1}`;
            } else {
                console.error('Invalid order ID received');
            }
        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

// ----------------- Render Items -----------------
function renderItems(items) {
    return items.map(item => `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4" onclick="addToOrder(${item.id})">
            <div class="card">
                <img src="images/itemImages/${item.image}" class="card-img-top" alt="Item Image">
                <div class="card-body">
                    <h5 class="card-title" id="itemName-${item.id}">${item.name}</h5>
                    <p class="card-text" id="itemPrice-${item.id}">LKR ${item.price}</p>
                </div>
            </div>
        </div>
    `).join("");
}

function loadAllItems() {
    scrollableDiv.innerHTML = renderItems(itemsList);
}

function loadBurgers() {
    scrollableDiv.innerHTML = renderItems(burgersArray);
}

function loadBeverages() {
    scrollableDiv.innerHTML = renderItems(beveragesArray);
}

function loadDesserts() {
    scrollableDiv.innerHTML = renderItems(dessertsArray);
}

// ----------------- Add To Order -----------------
function addToOrder(id) {
    const item = itemsList.find(item => item.id === id);
    if (!item) return;

    const order = ordersArray.find(order => order.id === id);
    if (order) {
        order.qty++;
    } else {
        ordersArray.push({ ...item, qty: 1 });
    }
    renderOrders();
    getTotal();
}

function incrementQty(id) {
    const order = ordersArray.find(order => order.id === id);
    if (order) {
        order.qty++;
        renderOrders();
        getTotal();
    }
}

function decrementQty(id) {
    const order = ordersArray.find(order => order.id === id);
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
    ordersFlow.innerHTML = ordersArray.map(order => `
        <div class="order-item d-flex align-items-center border-1 border-primary justify-content-between py-2" id="order-item-${order.id}">
            <span class="item-name flex-grow-1">${order.name}</span>
            <div class="item-qty-controls d-flex align-items-center mx-3">
                <button class="btn btn-sm btn-outline-primary" onclick="decrementQty(${order.id})">-</button>
                <span class="item-qty mx-2">${order.qty}</span>
                <button class="btn btn-sm btn-outline-primary" onclick="incrementQty(${order.id})">+</button>
            </div>
            <span class="price highlighted mx-3">LKR ${order.qty * order.price}</span>
            <button class="btn btn-close" aria-label="Close" onclick="removeOrder(${order.id})"></button>
        </div>
    `).join("");
}

// ----------------- Calculate Total and Discount -----------------
function getTotal() {
    const totalAmount = ordersArray.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const discountPercentage = parseFloat(txtDiscountRatio.value) || 0;
    const discount = (totalAmount * discountPercentage) / 100;
    const finalAmount = totalAmount - discount;

    totalPrice.textContent = `LKR ${totalAmount.toFixed(2)}`;
    discountPrice.textContent = `LKR ${discount.toFixed(2)}`;
    finalPriceElement.textContent = `LKR ${finalAmount.toFixed(2)}`;
}

txtDiscountRatio.addEventListener("input", getTotal);

// ----------------- Place Order -----------------
async function confirmOrder() {
    const customerName = cmbCustomer.value;
    const customer = customersArray.find(c => c.name === customerName);
    if (!customer) {
        alert("Please select a valid customer.");
        return;
    }

    const discount = parseFloat(txtDiscountRatio.value) || 0;
    const totalAmount = ordersArray.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const finalAmount = totalAmount - (totalAmount * discount / 100);

    const orderDetails = ordersArray.map(item => ({
        orderId: 1,
        itemId: item.id,
        quantity: item.qty,
        unitPrice: item.price
    }));

    const orderData = {
        date: new Date().toISOString().split('T')[0],
        customerId: customer.id,
        discountRate: discount,
        totalPrice: finalAmount,
        details: orderDetails
    };

    try {
        const response = await fetch("http://localhost:8080/home/addOrder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        });
        if (!response.ok) throw new Error("Failed to place order");
        showOrderConfirmation(customerName, ordersArray, discount, totalAmount, finalAmount);
    } catch (error) {
        console.error("Error placing order:", error);
        Swal.fire({
            icon: "error",
            title: "Order Failed!",
            text: "Something went wrong while placing the order. Please try again.",
        });
    }
}

// ----------------- Order Confirmation & PDF -----------------
function showOrderConfirmation(customerName, ordersArray, discount, totalAmount, finalAmount) {
    Swal.fire({
        title: "Order Placed!",
        html: `
            <div style="text-align: left; font-family: Arial, sans-serif; line-height: 1.6;">
                <p><strong>Customer:</strong> ${customerName || "N/A"}</p>
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
                                <td style="padding: 8px;">${item.name}</td>
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
            generateInvoicePDF(customerName, ordersArray, discount, totalAmount, finalAmount);
        }
    });
}

// ----------------- PDF Invoice Generation -----------------
function generateInvoicePDF(customerName, ordersArray, discount, totalAmount, finalAmount) {
    const doc = new jsPDF('p', 'mm', 'a5');
    doc.setFont("helvetica");

    const pageWidth = 148;
    const leftMargin = 20;
    let yPosition = 20;

    doc.setFontSize(28);
    doc.text("MOS BURGERS", pageWidth / 2, yPosition, null, null, "center");
    yPosition += 10;
    doc.setFontSize(18);
    doc.text("INVOICE", pageWidth / 2, yPosition, null, null, "center");
    yPosition += 10;

    doc.setFontSize(11);
    doc.text(`Customer: ${customerName || "N/A"}`, leftMargin, yPosition);
    yPosition += 5;
    doc.text(`Date: ${new Date().toLocaleDateString()}`, leftMargin, yPosition);
    yPosition += 8;

    doc.setLineWidth(0.5);
    doc.setFont("", "bold");
    doc.rect(leftMargin, yPosition, 108, 7);
    doc.text("Item", leftMargin + 5, yPosition + 5);
    doc.text("Price", leftMargin + 50, yPosition + 5);
    doc.text("Qty", leftMargin + 73, yPosition + 5);
    doc.text("Amount", leftMargin + 90, yPosition + 5);

    doc.setFont("", "regular");
    ordersArray.forEach(item => {
        yPosition += 7;
        doc.rect(leftMargin, yPosition, 108, 7);
        doc.text(item.name.substring(0, 30), leftMargin + 5, yPosition + 5);
        doc.text(item.price.toFixed(2), leftMargin + 50, yPosition + 5);
        doc.text(item.qty.toString(), leftMargin + 75, yPosition + 5);
        doc.text((item.qty * item.price).toFixed(2), leftMargin + 90, yPosition + 5);
    });
    yPosition += 17;

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

// ----------------- Search Items -----------------
function searchItem() {
    const searchTerm = document.getElementById("txtSearchBar").value.toLowerCase();
    const filteredItems = itemsList.filter(item => item.name.toLowerCase().includes(searchTerm));
    scrollableDiv.innerHTML = filteredItems.length ? renderItems(filteredItems) : `
        <div class="col-12">
            <p class="text-center">No items match your search.</p>
        </div>`;
}

// ----------------- Load Customers -----------------
async function loadCustomersFromDB() {
    try {
        const response = await fetch("http://localhost:8080/customer/all");
        if (!response.ok) throw new Error("Failed to fetch customers");
        customersArray = await response.json();
        loadCustomerComboBox();
    } catch (error) {
        console.error("Error loading customers:", error);
    }
}

function loadCustomerComboBox() {
    cmbCustomer.innerHTML = `
        <option value="" disabled selected>Select Customer</option>
        ${customersArray.map(customer => `
            <option value="${customer.name}">${customer.name}</option>
        `).join("")}
    `;
}

// ----------------- Add Customer -----------------
async function addCustomer() {
    const { value: formValues } = await Swal.fire({
        title: "Add Customer",
        html: `
            <input type="text" id="addCustomerName" class="swal2-input" placeholder="Customer Name">
            <input type="text" id="addMobileNumber" class="swal2-input" placeholder="Mobile Number">
        `,
        showCancelButton: true,
        confirmButtonText: "Add Customer",
        preConfirm: () => {
            const name = document.getElementById("addCustomerName").value.trim();
            const mobile = document.getElementById("addMobileNumber").value.trim();
            if (!name || !mobile) {
                Swal.showValidationMessage("All fields are required");
                return false;
            }
            return { name, mobile };
        }
    });

    if (formValues) {
        try {
            const response = await fetch("http://localhost:8080/customer/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formValues)
            });
            if (!response.ok) throw new Error("Failed to add customer");
            Swal.fire("Success!", "Customer added successfully.", "success");
            loadCustomersFromDB();
        } catch (error) {
            console.error("Error adding customer:", error);
            Swal.fire("Error!", "Failed to add customer. Please try again.", "error");
        }
    }
}

// ----------------- Load Date & Time -----------------
function loadDateTime() {
    const lblDateAndTime = document.getElementById("lblDateAndTime");
    if (lblDateAndTime) {
        lblDateAndTime.textContent = new Date().toLocaleString();
    }
}
setInterval(loadDateTime, 1000);
loadDateTime();

// ----------------- Initialize -----------------
loadItemsFromDB();
loadCustomersFromDB();
loadOrderID();