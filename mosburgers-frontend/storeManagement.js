// -------------------------- State Management --------------------------
let itemsList = [];

// -------------------------- DOM Elements --------------------------
const tableBody = document.getElementById("tableBody");
const txtSearchBar = document.getElementById("txtSearchBar");

// -------------------------- Load Items --------------------------
async function loadItemsFromDB() {
    try {
        const response = await fetch("http://localhost:8080/item/all");
        if (!response.ok) throw new Error("Failed to fetch items");
        itemsList = await response.json();
        loadAllItems(itemsList);
    } catch (error) {
        console.error("Error loading items:", error);
        tableBody.innerHTML = `<tr><td colspan="8" class="text-center">Failed to load items. Please try again later.</td></tr>`;
    }
}

// -------------------------- Load All Items into Table --------------------------
function loadAllItems(list) {
    if (!tableBody) return;

    const rows = list.map((item, index) => `
        <tr>
            <td onclick="showItemDetails(${index})">${item.id}</td>
            <td onclick="showItemDetails(${index})">
                <img src="images/itemImages/${item.image}" alt="${item.name}" class="img-fluid" style="max-width: 50px; height: auto;">
            </td>
            <td onclick="showItemDetails(${index})">${item.name}</td>
            <td onclick="showItemDetails(${index})">LKR ${item.price}</td>
            <td onclick="showItemDetails(${index})">${item.type}</td>
            <td onclick="showItemDetails(${index})">${item.quantity}</td>
            <td onclick="showItemDetails(${index})">${item.expiryDate}</td>
            <td class="text-center">
                <button class="btn btn-primary btn-sm" onclick="updateItem(event, ${index})">Update</button>
                <button class="btn btn-danger btn-sm" onclick="deleteItem(event, ${index})">Delete</button>
            </td>
        </tr>
    `).join("");

    tableBody.innerHTML = rows;
}

// -------------------------- Show Item Details --------------------------
function showItemDetails(index) {
    const item = itemsList[index];

    Swal.fire({
        title: item.name,
        html: `
            <div style="text-align: left;">
                <table class="table table-bordered table-striped">
                    <tr>
                        <td><strong>ID</strong></td>
                        <td>${item.id}</td>
                    </tr>
                    <tr>
                        <td><strong>Price</strong></td>
                        <td>LKR ${item.price}</td>
                    </tr>
                    <tr>
                        <td><strong>Type</strong></td>
                        <td>${item.type}</td>
                    </tr>
                    <tr>
                        <td><strong>Quantity</strong></td>
                        <td>${item.quantity}</td>
                    </tr>
                    <tr>
                        <td><strong>Expire Date</strong></td>
                        <td>${item.expiryDate}</td>
                    </tr>
                </table>
            </div>
            <div style="text-align: center; margin-top: 15px;">
                <img src="images/itemImages/${item.image}" alt="${item.name}" class="img-fluid" style="max-width: 250px; height: auto; border-radius: 10px;">
            </div>
        `,
        showConfirmButton: false,
        footer: `
            <div style="text-align: center; margin-top: 15px;">
                <button class="btn btn-primary fw-bold" onclick="updateItem(event, ${index})">Update</button>
                <button class="btn btn-danger fw-bold" onclick="deleteItem(event, ${index})">Delete</button>
            </div>
        `
    });
}

// -------------------------- Search Items --------------------------
function searchItem() {
    const searchQuery = txtSearchBar.value.trim().toLowerCase();
    const filteredItems = itemsList.filter(item => item.name.toLowerCase().includes(searchQuery));
    loadAllItems(filteredItems);
}

async function addItem() {
    const newItemId = itemsList.length > 0 ? Math.max(...itemsList.map(item => item.id)) + 1 : 1;

    const { value: formValues } = await Swal.fire({
        title: "Add Item",
        html: `
            <input type="text" id="addItemId" class="swal2-input" value="${newItemId}" readonly>
            <input type="text" id="addItemName" class="swal2-input" placeholder="Item Name" required>
            <input type="number" id="addPrice" class="swal2-input" placeholder="Unit Price" required>
            <select id="addType" class="swal2-input" required>
                <option value="" disabled selected>Select Item Type</option>
                <option value="Burger">Burger</option>
                <option value="Beverage">Beverage</option>
                <option value="Dessert">Dessert</option>
            </select>
            <input type="number" id="addQty" class="swal2-input" placeholder="Quantity" required>
            <input type="file" id="addImage" class="swal2-input" accept="image/*" required>
            <input type="date" id="addExpireDate" class="swal2-input" placeholder="Expire Date" required>
        `,
        showCancelButton: true,
        confirmButtonText: "Add Item",
        preConfirm: () => {
            const name = document.getElementById("addItemName").value.trim();
            const price = parseFloat(document.getElementById("addPrice").value);
            const qty = parseInt(document.getElementById("addQty").value, 10);
            const type = document.getElementById("addType").value;
            const expiryDate = document.getElementById("addExpireDate").value;
            const image = document.getElementById("addImage").files[0]?.name;

            if (!name || isNaN(price) || price <= 0 || isNaN(qty) || qty <= 0 || !type || !expiryDate || !image) {
                Swal.showValidationMessage("All fields are required and must be valid.");
                return false;
            }

            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const raw = JSON.stringify({
                "name": name,
                "price": price,
                "qty": qty,
                "type": type,
                "image": image,
                "expiryDate": expiryDate
            });

            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow"
            };

            return fetch("http://localhost:8080/item/add", requestOptions)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to add item.");
                    }
                    return response.text();
                })
                .then((result) => {
                    Swal.fire({icon: "success", title: "Success", text: "Item added successfully!"});
                    loadItemsFromDB();
                })
                .catch((error) => {
                    Swal.fire({icon: "error", title: "Error", text: "Failed to add item. Please try again."});
                    console.error(error);
                });
        }
    });
}


// -------------------------- Update Item --------------------------
async function updateItem(event, index) {
    event.stopPropagation();

    const item = itemsList[index];
    const formattedExpireDate = new Date(item.expiryDate).toISOString().split("T")[0];

    const { value: formValues } = await Swal.fire({
        title: `Update Item - ${item.name}`,
        html: `
            <input type="text" id="updateItemId" class="swal2-input" value="${item.id}" disabled>
            <input type="text" id="updateName" class="swal2-input" value="${item.name}" required>
            <input type="number" id="updatePrice" class="swal2-input" value="${item.price}" required>
            <input type="number" id="updateQty" class="swal2-input" value="${item.quantity}" required>
            <select id="updateType" class="swal2-input" required>
                <option value="Burger" ${item.type === "Burger" ? "selected" : ""}>Burger</option>
                <option value="Beverage" ${item.type === "Beverage" ? "selected" : ""}>Beverage</option>
                <option value="Dessert" ${item.type === "Dessert" ? "selected" : ""}>Dessert</option>
            </select>
            <input type="file" id="updateImage" class="swal2-input" accept="image/*">
            <input type="date" id="updateExpireDate" class="swal2-input" value="${formattedExpireDate}" required>
        `,
        showCancelButton: true,
        confirmButtonText: "Update",
        preConfirm: () => {
            const name = document.getElementById("updateName").value.trim();
            const price = parseFloat(document.getElementById("updatePrice").value);
            const qty = parseInt(document.getElementById("updateQty").value, 10);
            const type = document.getElementById("updateType").value;
            const expiryDate = document.getElementById("updateExpireDate").value;
            const image = document.getElementById("updateImage").files[0]?.name || item.image;

            if (!name || isNaN(price) || price <= 0 || isNaN(qty) || qty <= 0 || !type || !expiryDate) {
                Swal.showValidationMessage("All fields are required and must be valid.");
                return false;
            }

            return { id: item.id, name, price, quantity: qty, type, image, expiryDate };
        }
    });

    if (formValues) {
        try {
            const response = await fetch("http://localhost:8080/item/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formValues)
            });
            if (!response.ok) throw new Error("Failed to update item");
            Swal.fire("Success!", "Item has been updated.", "success");
            await loadItemsFromDB();
        } catch (error) {
            console.error("Error updating item:", error);
            Swal.fire("Error!", "Failed to update item. Try again.", "error");
        }
    }
}

// -------------------------- Delete Item --------------------------
async function deleteItem(event, index) {
    event.stopPropagation();

    const item = itemsList[index];
    const confirmResult = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this item?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
    });

    if (confirmResult.isConfirmed) {
        try {
            const response = await fetch(`http://localhost:8080/item/delete/${item.id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete item");
            Swal.fire("Deleted!", "Item has been deleted.", "success");
            await loadItemsFromDB();
        } catch (error) {
            console.error("Error deleting item:", error);
            Swal.fire("Error!", "Failed to delete item. Try again.", "error");
        }
    }
}

// -------------------------- Initialization --------------------------
loadItemsFromDB();
txtSearchBar.addEventListener("input", searchItem);