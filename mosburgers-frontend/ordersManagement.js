let orderList = [];
let customerList = [];
let itemList = [];

// Load order history from the backend
function loadOrderHistoryFromDB() {
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("http://localhost:8080/order/all", requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((result) => {
            orderList = result;
            return fetch("http://localhost:8080/customer/all", requestOptions);
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((result) => {
            customerList = result;
            return fetch("http://localhost:8080/item/all", requestOptions);
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((result) => {
            itemList = result;
            loadAllOrders();
        })
        .catch((error) => {
            console.error('There was a problem with the fetch operation:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong while fetching data!',
            });
        });
}

// Load all orders into the table
function loadAllOrders() {
    let tableBody = document.getElementById("ordersList");
    let body = ``;

    orderList.forEach((order, index) => {
        let customerName = "N/A";
        customerList.forEach((customer) => {
            if (customer.id === order.customerId) {
                customerName = customer.name;
            }
        });

        order.details.forEach((detail) => {
            let itemName = "N/A";
            let unitPrice = 0;
            itemList.forEach((item) => {
                if (item.id === detail.itemId) {
                    itemName = item.name;
                    unitPrice = item.price;
                }
            });

            const totalAmount = detail.quantity * unitPrice;
            const discountAmount = (order.discountRate / 100) * totalAmount;
            const finalAmount = totalAmount - discountAmount;

            body += `
                <tr>
                    <td>${order.date}</td>
                    <td>${customerName}</td>
                    <td>${itemName}</td>
                    <td>LKR ${unitPrice.toFixed(2)}</td>
                    <td>${detail.quantity}</td>
                    <td>LKR ${totalAmount.toFixed(2)}</td>
                    <td>${order.discountRate}%</td>
                    <td>LKR ${discountAmount.toFixed(2)}</td>
                    <td>LKR ${finalAmount.toFixed(2)}</td>
                    <td class="actions-column">
                        <button class="btn btn-primary btn-sm" onclick="viewOrderDetails(${index})">
                            View
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteOrder(${index})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });
    });

    tableBody.innerHTML = body;
}

// View order details in a modal
function viewOrderDetails(index) {
    const order = orderList[index];
    let customerName = "N/A";
    customerList.forEach((customer) => {
        if (customer.id === order.customerId) {
            customerName = customer.name;
        }
    });

    let itemsHTML = ``;
    order.details.forEach((detail) => {
        let itemName = "N/A";
        let unitPrice = 0;
        itemList.forEach((item) => {
            if (item.id === detail.itemId) {
                itemName = item.name;
                unitPrice = item.price;
            }
        });

        const totalAmount = detail.quantity * unitPrice;
        itemsHTML += `
            <tr>
                <td>${itemName}</td>
                <td>LKR ${unitPrice.toFixed(2)}</td>
                <td>${detail.quantity}</td>
                <td>LKR ${totalAmount.toFixed(2)}</td>
            </tr>
        `;
    });

    Swal.fire({
        title: "Order Details",
        html: `
            <div style="text-align: left;">
                <p><strong>Customer:</strong> ${customerName}</p>
                <p><strong>Order Date:</strong> ${order.date}</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <thead>
                        <tr style="background-color: #f8f9fa; border-bottom: 2px solid #ddd;">
                            <th style="text-align: left; padding: 8px;">Item</th>
                            <th style="text-align: left; padding: 8px;">Price</th>
                            <th style="text-align: left; padding: 8px;">Qty</th>
                            <th style="text-align: left; padding: 8px;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHTML}
                    </tbody>
                </table>
                <p style="margin-top: 10px;">
                    <strong>Total Amount:</strong> LKR ${order.totalPrice.toFixed(2)}
                </p>
                <p>
                    <strong>Discount Rate:</strong> ${order.discountRate}%
                </p>
                <p>
                    <strong>Final Amount:</strong> LKR ${(order.totalPrice - (order.totalPrice * order.discountRate / 100)).toFixed(2)}
                </p>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Print Bill",
        cancelButtonText: "Close",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            generatePDF(index);
        }
    });
}

// Generate PDF for an order
function generatePDF(index) {
    const order = orderList[index];
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
    doc.text(`Customer: ${customerList.find(c => c.id === order.customerId)?.name || "N/A"}`, leftMargin, yPosition);
    yPosition += 5;
    doc.text(`Date: ${order.date}`, leftMargin, yPosition);
    yPosition += 8;

    doc.setFontSize(11);
    doc.setLineWidth(0.5);
    doc.setFont("", "bold");
    doc.rect(leftMargin, yPosition, 108, 7);
    doc.text("Item", leftMargin + 5, yPosition + 5);
    doc.text("Price", leftMargin + 50, yPosition + 5);
    doc.text("Qty", leftMargin + 73, yPosition + 5);
    doc.text("Amount", leftMargin + 90, yPosition + 5);

    doc.setFont("", "regular");
    order.details.forEach((detail) => {
        yPosition += 7;
        doc.rect(leftMargin, yPosition, 108, 7);
        const item = itemList.find(i => i.id === detail.itemId);
        const itemName = item?.name || "Unknown Item";
        const totalAmount = detail.quantity * item?.price;
        doc.text(itemName.substring(0, 30), leftMargin + 5, yPosition + 5);
        doc.text(`LKR ${item?.price.toFixed(2)}`, leftMargin + 50, yPosition + 5);
        doc.text(`${detail.quantity}`, leftMargin + 75, yPosition + 5);
        doc.text(`LKR ${totalAmount.toFixed(2)}`, leftMargin + 90, yPosition + 5);
    });
    yPosition += 17;

    doc.setFontSize(11);
    doc.text(`Total Amount   : LKR ${order.totalPrice.toFixed(2)}`, leftMargin, yPosition);
    yPosition += 5;
    doc.text(`Discount Rate  : ${order.discountRate}%`, leftMargin, yPosition);
    yPosition += 5;
    doc.text(`Discount Price : LKR ${(order.totalPrice * order.discountRate / 100).toFixed(2)}`, leftMargin, yPosition);
    yPosition += 5;
    doc.text(`Final Amount   : LKR ${(order.totalPrice - (order.totalPrice * order.discountRate / 100)).toFixed(2)}`, leftMargin, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    doc.text("Thank you for your purchase!", pageWidth / 2, yPosition, null, null, "center");

    doc.save("Order_Bill.pdf");
}

// Delete an order
function deleteOrder(index) {
    Swal.fire({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this order!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
    }).then((result) => {
        if (result.isConfirmed) {
            orderList.splice(index, 1);
            loadAllOrders();
            Swal.fire(
                "Deleted!",
                "The order has been deleted successfully.",
                "success"
            );
        }
    });
}

// Search orders by date
function searchOrderByDate() {
    const searchDate = document.getElementById("txtSearchDateBar").value;
    if (!searchDate) {
        Swal.fire("Invalid Input", "Please enter a valid date to search!", "warning");
        return;
    }

    const filteredOrders = orderList.filter(order => order.date === searchDate);
    if (filteredOrders.length > 0) {
        loadFilteredOrders(filteredOrders);
    } else {
        Swal.fire("No Orders Found", `No orders were placed on ${searchDate}.`, "info");
    }
}

// Load filtered orders into the table
function loadFilteredOrders(filteredOrders) {
    let tableBody = document.getElementById("ordersList");
    let body = ``;

    filteredOrders.forEach((order, index) => {
        let customerName = "N/A";
        customerList.forEach((customer) => {
            if (customer.id === order.customerId) {
                customerName = customer.name;
            }
        });

        order.details.forEach((detail) => {
            let itemName = "N/A";
            let unitPrice = 0;
            itemList.forEach((item) => {
                if (item.id === detail.itemId) {
                    itemName = item.name;
                    unitPrice = item.price;
                }
            });

            const totalAmount = detail.quantity * unitPrice;
            const discountAmount = (order.discountRate / 100) * totalAmount;
            const finalAmount = totalAmount - discountAmount;

            body += `
                <tr>
                    <td>${order.date}</td>
                    <td>${customerName}</td>
                    <td>${itemName}</td>
                    <td>LKR ${unitPrice.toFixed(2)}</td>
                    <td>${detail.quantity}</td>
                    <td>LKR ${totalAmount.toFixed(2)}</td>
                    <td>${order.discountRate}%</td>
                    <td>LKR ${discountAmount.toFixed(2)}</td>
                    <td>LKR ${finalAmount.toFixed(2)}</td>
                    <td class="actions-column">
                        <button class="btn btn-primary btn-sm" onclick="viewOrderDetails(${index})">
                            View
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="deleteOrder(${index})">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });
    });

    tableBody.innerHTML = body;
}

// Generate daily orders chart
let currentChart = null;

function dailyOrdersChart() {
    const tableDiv = document.getElementById('ordersList');
    const canvas = document.getElementById('ordersChart');

    tableDiv.style.display = 'none';
    canvas.style.display = 'block';

    if (currentChart) {
        currentChart.destroy();
    }

    const dailyOrderCounts = {};
    orderList.forEach(order => {
        const date = order.date;
        dailyOrderCounts[date] = (dailyOrderCounts[date] || 0) + 1;
    });

    const ctx = canvas.getContext('2d');
    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(dailyOrderCounts),
            datasets: [{
                label: '# of Orders',
                data: Object.values(dailyOrderCounts),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                borderRadius: 8,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Daily Orders Chart',
                    font: { size: 18, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

// Initial load
loadOrderHistoryFromDB();