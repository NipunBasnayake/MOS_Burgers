// ---------------------- Initializations --------------------------

let itemsList = [];
let ordersArray = [];
let scrollableDiv = document.getElementById("scrollableDiv");
const ordersFlow = document.getElementById("ordersFlow");

loadItemsFromLocalStorage();
loadAllItems();


// ---------------------- Local Storage Functions --------------------------

function saveItemsToLocalStorage() {
    localStorage.setItem("itemsList", JSON.stringify(itemsList));
}

function loadItemsFromLocalStorage() {
    const storedItems = localStorage.getItem("itemsList");
    itemsList = storedItems ? JSON.parse(storedItems) : [];
}


function loadAllItems() {
    let tableHTML = `
        <table class="table table-bordered table-striped table-light mx-auto" style="width:95%">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Item Name</th>
                    <th>Price</th>
                    <th>Type</th>
                    <th>Qty</th>
                    <th>Expire Date</th>
                    <th class="actions-column text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    itemsList.forEach((element, index) => {
        tableHTML += `
            <tr>
                <td onclick="showItemDetails(${index})">${element.id}</td>
                <td onclick="showItemDetails(${index})">
                    <img src="images/itemImages/${element.image}" alt="${element.itemName}" class="img-fluid" style="max-width: 50px; height: auto;">
                </td>
                <td onclick="showItemDetails(${index})">${element.itemName}</td>
                <td onclick="showItemDetails(${index})">LKR ${element.price}</td>
                <td onclick="showItemDetails(${index})">${element.type}</td>
                <td onclick="showItemDetails(${index})">${element.qty}</td>
                <td onclick="showItemDetails(${index})">${element.expireDate}</td>
                <td class="text-center">
                    <button class="btn btn-primary btn-sm" onclick="updateItem(event, ${index})">Update</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteItem(event, ${index})">Delete</button>
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

function showItemDetails(index) {
    const item = itemsList[index];

    Swal.fire({
        title: item.itemName,
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
                        <td>${item.qty}</td>
                    </tr>
                    <tr>
                        <td><strong>Expire Date</strong></td>
                        <td>${item.expireDate}</td>
                    </tr>
                </table>
            </div>

            <!-- Image Display -->
            <div style="text-align: center; margin-top: 15px;">
                <img 
                    src="images/itemImages/${item.image}" 
                    alt="${item.itemName}" 
                    class="img-fluid" 
                    style="max-width: 250px; height: auto; border-radius: 10px;">
            </div>
        `,showConfirmButton: false
    });
    const buttonsHTML = `
        <div style="text-align: center; margin-top: 15px;">
            <button class="btn btn-primary fw-bold" onclick="updateItem(event, ${index})">Update</button>
            <button class="btn btn-danger fw-bold" onclick="deleteItem(event, ${index})">Delete</button>
        </div>
    `
    const swalFooter = document.querySelector('.swal2-footer');
    if (swalFooter) {
        swalFooter.innerHTML = buttonsHTML;
    }
}


// ---------------------- Search Items --------------------------

function searchItem() {
    const txtSearchBar = document.getElementById("txtSearchBar").value.toLowerCase().trim();
    let filteredItems = itemsList.filter(item => item.itemName.toLowerCase().includes(txtSearchBar));

    if (filteredItems.length === 0) {
        scrollableDiv.innerHTML = `
            <div class="col-12">
                <p class="text-center">No items match your search.</p>
            </div>`;
    } else {
        scrollableDiv.innerHTML = filteredItems.map((element, index) => `
            <div class="col-lg-2 col-md-4 col-sm-6 mb-4" onclick="addToOrder(${index})">
                <div class="card">
                    <img src="images/itemImages/${element.image}" class="card-img-top" alt="${element.itemName}" style="width: auto; max-height: 300px;">
                    <div class="card-body">
                        <h5 class="card-title">${element.itemName}</h5>
                        <p class="card-text">LKR ${element.price}</p>
                        <div class="d-flex justify-content-between mt-2">
                            <button class="btn btn-primary btn-sm" onClick="updateItem(${index})">Update</button>
                            <button class="btn btn-danger btn-sm" onClick="deleteItem(${index})">Delete</button>
                        </div>
                    </div>
                </div>
            </div>`).join('');
    }
}


// ---------------------- Add Items --------------------------

function addItem() {
    const newItemId = itemsList.length > 0 ? Math.max(...itemsList.map(item => item.id)) + 1 : 1;

    Swal.fire({
        title: "Add Item",
        html: `
            <input type="text" id="addItemId" class="swal2-input" value="${newItemId}" readonly>
            <input type="text" id="addItemName" class="swal2-input" placeholder="Item Name">
            <input type="number" id="addPrice" class="swal2-input" placeholder="Unit Price">
            <select id="addType" class="swal2-input">
                <option value="" disabled selected>Select Item Type</option>
                <option value="Burger">Burger</option>
                <option value="Beverage">Beverage</option>
                <option value="Dessert">Dessert</option>
            </select>
            <input type="number" id="addQty" class="swal2-input" placeholder="Quantity">
            <input type="file" id="addImage" class="swal2-input" accept="image/*">
            <input type="date" id="addExpireDate" class="swal2-input" placeholder="Expire Date">
        `,
        showCancelButton: true,
        confirmButtonText: "Add Item",
        preConfirm: () => {
            const addItemName = document.getElementById("addItemName").value.trim();
            const addPrice = parseFloat(document.getElementById("addPrice").value);
            const addQty = parseInt(document.getElementById("addQty").value, 10);
            const addType = document.getElementById("addType").value;
            const addExpireDate = document.getElementById("addExpireDate").value;
            const addImageInput = document.getElementById("addImage").value;

            if (!addItemName || isNaN(addPrice) || addPrice <= 0 || isNaN(addQty) || addQty <= 0 || !addType || !addExpireDate || !addImageInput) {
                Swal.fire("Error!", "All fields are required.", "error");
                return false;
            }

            const addImage = addImageInput.split("\\").pop();

            itemsList.push({
                id: newItemId,
                itemName: addItemName,
                price: addPrice,
                qty: addQty,
                type: addType,
                image: addImage,
                expireDate: addExpireDate,
            });

            saveItemsToLocalStorage();
            loadAllItems();
        },
    }).then((result) => {
        if (result.isConfirmed) Swal.fire("Success!", "Item added.", "success");
    });
}


// ---------------------- Update Items --------------------------

function updateItem(event, index) {
    event.stopPropagation();

    const item = itemsList[index];
    const formattedExpireDate = new Date(item.expireDate).toISOString().split("T")[0];

    Swal.fire({
        title: `Update Item - ${item.itemName}`,
        html: `
            <input type="text" id="updateItemId" class="swal2-input" value="${item.id}" disabled>
            <input type="text" id="updateName" class="swal2-input" value="${item.itemName}">
            <input type="number" id="updatePrice" class="swal2-input" value="${item.price}">
            <input type="number" id="updateQty" class="swal2-input" value="${item.qty}">
            <select id="updateType" class="swal2-input">
                <option value="Burger" ${item.type === "Burger" ? "selected" : ""}>Burger</option>
                <option value="Beverage" ${item.type === "Beverage" ? "selected" : ""}>Beverage</option>
                <option value="Dessert" ${item.type === "Dessert" ? "selected" : ""}>Dessert</option>
            </select>
            <input type="file" id="updateImage" class="swal2-input" accept="image/*">
            <input type="date" id="updateExpireDate" class="swal2-input" value="${formattedExpireDate}">
        `,
        showCancelButton: true,
        confirmButtonText: "Update",
        preConfirm: () => {
            const updatedName = document.getElementById("updateName").value.trim();
            const updatedPrice = parseFloat(document.getElementById("updatePrice").value);
            const updatedQty = parseInt(document.getElementById("updateQty").value, 10);
            const updatedType = document.getElementById("updateType").value;
            const updatedImageInput = document.getElementById("updateImage").files[0]; 
            const updatedExpireDate = document.getElementById("updateExpireDate").value;

            if (!updatedName) {
                Swal.showValidationMessage("Name cannot be empty.");
                return false;
            }
            if (isNaN(updatedPrice) || updatedPrice <= 0) {
                Swal.showValidationMessage("Please enter a valid price.");
                return false;
            }
            if (isNaN(updatedQty) || updatedQty <= 0) {
                Swal.showValidationMessage("Please enter a valid quantity.");
                return false;
            }
            if (!updatedType) {
                Swal.showValidationMessage("Please select a valid type.");
                return false;
            }
            if (!updatedExpireDate) {
                Swal.showValidationMessage("Expire date cannot be empty.");
                return false;
            }

            const updatedImage = updatedImageInput ? updatedImageInput.name : item.image; 
 
            itemsList[index] = {
                ...item,
                itemName: updatedName,
                price: updatedPrice,
                qty: updatedQty,
                type: updatedType,
                image: updatedImage,
                expireDate: updatedExpireDate,
            };

            saveItemsToLocalStorage();

            return true;
        },
    }).then((result) => {
        if (result.isConfirmed) {
            loadAllItems();
            Swal.fire("Updated!", "The item has been updated.", "success");
        }
    });
}


// ---------------------- Delete Items --------------------------

function deleteItem(index) {
    Swal.fire({
        title: "Are you sure?",
        text: "Do you want to delete this item?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel",
    }).then((result) => {
        if (result.isConfirmed) {
            itemsList.splice(index, 1);

            saveItemsToLocalStorage();
            loadAllItems();

            Swal.fire("Deleted!", "The item has been deleted.", "success");
        }
    });
}


// ---------------------- Save to Local Storage --------------------------

function saveItemsToLocalStorage() {
    localStorage.setItem("itemsList", JSON.stringify(itemsList));
}

function loadItemsFromLocalStorage() {
    const storedItems = localStorage.getItem("itemsList");
    if (storedItems) {
        itemsList = JSON.parse(storedItems);
    } else {
        saveItemsToLocalStorage();
    }
}

loadItemsFromLocalStorage();

