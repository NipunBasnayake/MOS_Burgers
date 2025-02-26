let orderHistory = [];


loadAllOrders();




function loadAllOrders() {
    let scrollableDiv = document.getElementById("ordersList");

    let tableHTML = `
        <table class="table table-bordered table-striped table-light mx-auto" style="width:95%">
            <thead class="table-dark">
                <tr>
                    <th>Order Date</th>
                    <th>Customer</th>
                    <th>Total Amount</th>
                    <th>Discount Rate</th>
                    <th>Discount</th>
                    <th>Final Amount</th>
                    <th class="actions-column text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    orderHistory.forEach((order, index) => {
        tableHTML += `
            <tr>
                <td>${order.orderDate}</td>
                <td>${order.customer}</td>
                <td>LKR ${order.totalAmount.toFixed(2)}</td>
                <td>${order.discount}%</td>
                <td>${(order.discount*order.totalAmount/100)}</td>
                <td>LKR ${order.finalAmount.toFixed(2)}</td>
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

    tableHTML += `
            </tbody>
        </table>
    `;

    scrollableDiv.innerHTML = tableHTML;
}

function viewOrderDetails(index) {
    const order = orderHistory[index];

    Swal.fire({
        title: "Order Placed!",
        html: `
            <div style="text-align: left; font-family: Arial, sans-serif; line-height: 1.3; font-size:16px;">
                <p><strong>Customer:</strong> ${order.customer || "N/A"}</p>
                <p><strong>Order Date:</strong> ${order.orderDate}</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <thead>
                        <tr style="background-color: #f8f9fa; border-bottom: 2px solid #ddd;">
                            <th style="text-align: left; padding: 8px; font-weight: bold;">Item</th>
                            <th style="text-align: left; padding: 8px; font-weight: bold;">Price</th>
                            <th style="text-align: left; padding: 8px; font-weight: bold;">Qty</th>
                            <th style="text-align: left; padding: 8px; font-weight: bold;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr style="border-bottom: 1px solid #ddd;">
                                <td style="padding: 8px;">${item.itemName}</td>
                                <td style="padding: 8px;">${item.price.toFixed(2)}</td>
                                <td style="padding: 8px;">${item.qty}</td>
                                <td style="padding: 8px;">${(item.qty * item.price).toFixed(2)}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
                <p style="margin-top: 10px; font-size: 1rem;">
                    <strong>Total Amount:</strong> LKR ${order.totalAmount.toFixed(2)}
                </p>
                <p style="font-size: 1rem;">
                    <strong>Discount:</strong> ${order.discount}%
                </p>
                <p style="font-size: 1rem;">
                    <strong>Final Amount:</strong> LKR ${order.finalAmount.toFixed(2)}
                </p>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: "Print Bill",
        cancelButtonText: "Cancel",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            generatePDF(index);
        }
    });
}

function generatePDF(index) {
    const order = orderHistory[index];
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
    doc.text(`Customer: ${order.customer || "N/A"}`, leftMargin, yPosition);
    yPosition += 5;
    doc.text(`Date: ${new Date(order.orderDate).toLocaleDateString()}`, leftMargin, yPosition);
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
    order.items.forEach((item) => {
        yPosition += 7;
        doc.rect(leftMargin, yPosition, 108, 7);
        let itemName = (item.itemName || "Unknown Item").substring(0, 30);
        doc.text(itemName, leftMargin + 5, yPosition + 5);
        doc.text(`${item.price.toFixed(2)}`, leftMargin + 50, yPosition + 5);
        doc.text(`${item.qty || 0}`, leftMargin + 75, yPosition + 5);
        doc.text(`${(item.qty * item.price).toFixed(2)}`, leftMargin + 90, yPosition + 5);
    });
    yPosition += 17;

    doc.setFontSize(11);
    doc.text(`Total Amount   : LKR ${order.totalAmount.toFixed(2)}`, leftMargin, yPosition);
    yPosition += 5;
    doc.text(`Discount Rate  : ${order.discount}%`, leftMargin, yPosition);
    yPosition += 5;
    doc.text(`Discount Price : LKR ${(order.totalAmount * order.discount / 100).toFixed(2)}`, leftMargin, yPosition);
    yPosition += 5;
    doc.text(`Final Amount   : LKR ${order.finalAmount.toFixed(2)}`, leftMargin, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    doc.text("Thank you for your purchase!", pageWidth / 2, yPosition, null, null, "center");

    doc.save("Order_Bill.pdf");
}


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
            orderHistory.splice(index, 1);
            loadAllOrders();
            Swal.fire(
                "Deleted!",
                "The order has been deleted successfully.",
                "success"
            );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
                "Cancelled",
                "Your order is safe!",
                "info"
            );
        }
    });
}

// ----------------------------- Table by search ----------------------------

function searchOrderByDate() {
    const searchDate = document.getElementById("txtSearchDateBar").value;

    if (!searchDate) {
        showAlert("Invalid Input", "Please enter a valid date to search!", "warning");
        return;
    }

    const formattedSearchDate = formatDate(searchDate);
    const filteredOrders = getFilteredOrders(formattedSearchDate);

    const canvasChart = document.getElementById('ordersChart');
    const tableDiv = document.getElementById('ordersList');
    canvasChart.style.display = 'none';
    tableDiv.style.display = 'block';

    if (filteredOrders.length > 0) {
        loadFilteredOrders(filteredOrders);
    } else {
        showAlert("No Orders Found", `No orders were placed on ${formattedSearchDate}.`, "info");
    }
}

function formatDate(date) {
    return new Date(date).toISOString().split("T")[0];
}

function getFilteredOrders(formattedSearchDate) {
    return orderHistory.filter(order => {
        const orderDate = formatDate(order.orderDate);
        return orderDate === formattedSearchDate;
    });
}

function showAlert(title, text, icon) {
    Swal.fire(title, text, icon);
}

function loadFilteredOrders(filteredOrders) {
    let tableHTML = generateTableHTML(filteredOrders);
    document.getElementById("ordersList").innerHTML = tableHTML;
}

function generateTableHTML(filteredOrders) {
    let tableHTML = `
        <table class="table table-bordered table-striped table-light mx-auto" style="width:95%">
            <thead class="table-dark">
                <tr>
                    <th>Order Date</th>
                    <th>Customer</th>
                    <th>Total Amount</th>
                    <th>Discount Rate</th>
                    <th>Discount</th>
                    <th>Final Amount</th>
                    <th class="actions-column text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    filteredOrders.forEach((order, index) => {
        tableHTML += generateTableRow(order, index);
    });

    tableHTML += `</tbody></table>`;
    return tableHTML;
}

function generateTableRow(order, index) {
    const discountAmount = (order.discount * order.totalAmount / 100).toFixed(2);
    return `
        <tr>
            <td>${order.orderDate}</td>
            <td>${order.customer}</td>
            <td>LKR ${order.totalAmount.toFixed(2)}</td>
            <td>${order.discount}%</td>
            <td>${discountAmount}</td>
            <td>LKR ${order.finalAmount.toFixed(2)}</td>
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
}


// ----------------------------- Chart ----------------------------

let currentChart = null;

function dailyOrdersChart() {
    const tableDiv = document.getElementById('ordersList');
    const canvas = document.getElementById('ordersChart');

    tableDiv.style.display = 'none';

    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }
    const ctx = canvas.getContext('2d'); 

    if (currentChart) {
        currentChart.destroy();
    }

    const dailyOrderCounts = getDailyOrderCounts();

    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(dailyOrderCounts), 
            datasets: [{
                label: '# of Orders',
                data: Object.values(dailyOrderCounts), 
                borderWidth: 1,
                backgroundColor: getColorFunction(),
                borderColor: getColorFunction(true),
                borderRadius: 8,  
            }]
        },
        options: getChartOptions()
    });    
}

function showTable() {
    const tableDiv = document.getElementById('ordersList');
    const canvas = document.getElementById('ordersChart');

    tableDiv.style.display = 'block';
    canvas.style.display = 'none';
}

function showChart() {
    const tableDiv = document.getElementById('ordersList');
    const canvas = document.getElementById('ordersChart');

    tableDiv.style.display = 'none';
    canvas.style.display = 'block';

    dailyOrdersChart();
}

function getDailyOrderCounts() {
    const dailyOrderCounts = {};
    orderHistory.forEach(order => {
        const formattedDate = new Date(order.orderDate).toLocaleDateString();
        dailyOrderCounts[formattedDate] = (dailyOrderCounts[formattedDate] || 0) + 1;
    });
    return dailyOrderCounts;
}

function getColorFunction(isBorder = false) {
    const colors = [
        'rgba(54, 162, 235, 0.5)', 
        'rgba(255, 99, 132, 0.5)',
        'rgba(75, 192, 192, 0.5)', 
        'rgba(153, 102, 255, 0.5)', 
        'rgba(255, 159, 64, 0.5)',
        'rgba(255, 205, 86, 0.5)'  
    ];
    const borderColors = [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(255, 205, 86, 1)'
    ];
    return function(context) {
        const index = context.dataIndex;
        return isBorder ? borderColors[index % borderColors.length] : colors[index % colors.length];
    };
}

function getChartOptions() {
    return {
        responsive: true,
        plugins: {
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 12 },
                callbacks: { label: function(tooltipItem) { return `Orders: ${tooltipItem.raw}`; } }
            },
            legend: {
                display: true,
                position: 'top',
                labels: {
                    boxWidth: 20,
                    font: { size: 12 }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,  
                ticks: { stepSize: 1 },
                grid: { color: 'rgba(0, 0, 0, 0.1)' }
            },
            x: {
                grid: { color: 'rgba(0, 0, 0, 0.1)' }
            }
        },
        layout: {
            padding: { left: 20, right: 20, top: 20, bottom: 20 }
        },
        plugins: {
            title: {
                display: true,
                text: 'Daily Orders Chart',
                font: { size: 18, weight: 'bold' }
            }
        }
    };
}
