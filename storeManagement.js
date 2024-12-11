function searchItem() {
    let txtSearchBar = document.getElementById("txtSearchBar").value.toLowerCase().trim();
    let scrollableDiv = document.getElementById("scrollableDiv");

    scrollableDiv.innerHTML = "";

    // console.log(itemsList);

    itemsList.forEach((element, index) => {
        if (element.itemName.toLowerCase().includes(txtSearchBar)) {
            let searchItem = `
            <div class="col-lg-2 col-md-4 col-sm-6 mb-4" onclick="addToOrder(${index})">
                <div class="card">
                    <img src="images/itemImages/${element.image}" class="card-img-top" alt="${element.itemName}">
                    <div class="card-body">
                        <h5 class="card-title" id="itemName-${index}">${element.itemName}</h5>
                        <p class="card-text" id="itemPrice-${index}">LKR ${element.price}</p>
                        <div class="d-flex justify-content-between mt-2">
                            <button id="btnUpdate" class="btn btn-primary btn-sm" onClick="updateItem(${index})">Update</button>
                            <button id="btnDelete" class="btn btn-danger btn-sm" onClick="deleteItem(${index})">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            `;
            scrollableDiv.innerHTML += searchItem;
        }
    });

    if (scrollableDiv.innerHTML === "") {
        scrollableDiv.innerHTML = `
        <div class="col-12">
            <p class="text-center">No items match your search.</p>
        </div>`;
    }
    // console.log(itemsList);
}


function addItem() {
    // console.log(itemsList);
    
    Swal.fire({
        title: `Add Item`,
        html: `
            <input type="text" id="addItemId" class="swal2-input" value="${itemsList.length+1}" placeholder="">
            <input type="text" id="addItemName" class="swal2-input" placeholder="Item Name">
            <input type="number" id="addPrice" class="swal2-input" placeholder="Unit Price">
            <input type="text" id="addType" class="swal2-input" placeholder="Item Type">
            <input type="number" id="addQty" class="swal2-input" placeholder="Quantity">
            <input type="text" id="addImage" class="swal2-input" placeholder="Image Name with Extension">
            <input type="date" id="addExpireDate" class="swal2-input" placeholder="Expire Date">
        `,
        showCancelButton: true,
        confirmButtonText: "Add Item",
        preConfirm: () => {
            let addItemId = document.getElementById("addItemId").value.trim();
            let addItemName = document.getElementById("addItemName").value.trim();
            let addPrice = parseFloat(document.getElementById("addPrice").value);
            let addQty = parseInt(document.getElementById("addQty").value);
            let addType = document.getElementById("addType").value.trim();
            let addImage = document.getElementById("addImage").value.trim();
            let addExpireDate = document.getElementById("addExpireDate").value;


            if (!addItemId || !addItemName || isNaN(addPrice) || addPrice <= 0 || isNaN(addQty) || addQty <= 0 || !addType || !addImage || !addExpireDate) {
                Swal.fire("Error!", "All fields are required, and values must be valid.", "error");
                return false; 
            }
            itemsList.push({
                id: addItemId,
                itemName: addItemName,
                price: addPrice,
                qty: addQty,
                type: addType,
                image: addImage,
                expireDate: addExpireDate
            });            
            Swal.fire("Success!", "The item has been added.", "success");
        }
    })
}


function updateItem(index) {
    const item = itemsList[index];

    Swal.fire({
        title: `Update Item - ${item.itemName}`,
        html: `
            <input type="text" id="updateName" class="swal2-input" value="${item.itemName}">
            <input type="number" id="updatePrice" class="swal2-input" value="${item.price}">
            <input type="number" id="updateQty" class="swal2-input" value="${item.qty}">
        `,
        showCancelButton: true,
        confirmButtonText: "Update",
        preConfirm: () => {
            const updatedName = document.getElementById("updateName").value.trim();
            const updatedPrice = parseFloat(document.getElementById("updatePrice").value);
            const updatedQty = parseInt(document.getElementById("updateQty").value, 10);

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

            itemsList[index].itemName = updatedName;
            itemsList[index].price = updatedPrice;
            itemsList[index].qty = updatedQty;

            return true;
        },
    }).then((result) => {
        if (result.isConfirmed) {
            searchItem(); 
            Swal.fire("Updated!", "The item has been updated.", "success");
        }
    });
}


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
            searchItem();
            Swal.fire("Deleted!", "The item has been deleted.", "success");
        }
    });
    console.log(itemsList);
}


