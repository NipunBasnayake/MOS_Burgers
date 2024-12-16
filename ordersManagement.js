let orderHistory = [];

loadOrdersFromLocalStorage();
loadAllOrders();

function saveOrdersToLocalStorage() {
    localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
}

function loadOrdersFromLocalStorage() {
    const storedOrders = localStorage.getItem("orderHistory");
    orderHistory = storedOrders ? JSON.parse(storedOrders) : [];
}

function loadAllOrders() {
    let scrollableDiv = document.getElementById("ordersList");

    let tableHTML = `
        <table class="table table-bordered table-striped table-light mx-auto" style="width:95%">
            <thead class="table-dark">
                <tr>
                    <th>Order Date</th>
                    <th>Customer</th>
                    <th>Total Amount</th>
                    <th>Final Amount</th>
                    <th>Discount</th>
                    <<th class="actions-column text-center">Actions</th>
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
                <td>LKR ${order.finalAmount.toFixed(2)}</td>
                <td>${order.discount}%</td>
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
            <div style="text-align: left; font-family: Arial, sans-serif; line-height: 1.6;">
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
    orderHistory.splice(index, 1);
    saveOrdersToLocalStorage();
    loadAllOrders();
}
