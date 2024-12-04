function searchItem() {
    let txtSearchBar = document.getElementById("searchBar").value.toLowerCase().trim();
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


function addItem(){
    Swal.fire({
        title: `Update Item - ${item.itemName}`,
        html: `
            <input type="text" id="addItemId" class="swal2-input" placeholder="">
            <input type="text" id="addItemName" class="swal2-input" placeholder="">
            <input type="number" id="updatePrice" class="swal2-input" placeholder="">
            <input type="number" id="updateQty" class="swal2-input" placeholder="">
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

console.log(itemsList);



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


