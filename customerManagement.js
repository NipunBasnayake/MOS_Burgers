let customersArray = [];

loadCustomersFromLocalStorage();
loadAllCustomers();


// ---------------------- Local Storage Functions --------------------------

function saveItemsToLocalStorage() {
    localStorage.setItem("customers", JSON.stringify(customersArray));  
}

function loadItemsFromLocalStorage() {
    const storedCustomers = localStorage.getItem("customers");
    customersArray = storedCustomers ? JSON.parse(storedCustomers) : [];
}

function loadCustomersFromLocalStorage() {
    loadItemsFromLocalStorage(); 
    loadAllCustomers(); 
}


// ---------------------- Add Customer --------------------------

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
                id: customersArray.length + 1, 
                name: addCustomerName,
                mobileNumber: addMobileNumber
            });

            saveItemsToLocalStorage(); 
            loadAllCustomers();

            Swal.fire("Success!", "Customer has been added.", "success");
        }
    });
}


// ---------------------- Load Customer --------------------------

function loadAllCustomers() {
    let scrollableDiv = document.getElementById("customerList");

    let tableHTML = `
        <table class="table table-bordered table-striped table-light mx-auto" style="width:95%">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th class="actions-column">Actions</th> <!-- Apply custom class here -->
                </tr>
            </thead>
            <tbody>
    `;

    customersArray.forEach((customer, index) => {
        tableHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${customer.name}</td>
                <td>${customer.mobileNumber}</td>
                <td class="actions-column"> <!-- Apply custom class here -->
                    <button class="btn btn-success btn-sm" onclick="updateCustomer(${index})">
                        Update
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCustomer(${index})">
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


// ---------------------- Update Customer --------------------------

function updateCustomer(index) {
    const customer = customersArray[index];

    Swal.fire({
        title: `Update Customer`,
        html: `
            <input type="text" id="updateCustomerName" class="swal2-input" placeholder="Customer Name" value="${customer.name}">
            <input type="text" id="updateMobileNumber" class="swal2-input" placeholder="Mobile Number" value="${customer.mobileNumber}">
        `,
        showCancelButton: true,
        confirmButtonText: "Update Customer",
        preConfirm: () => {
            let updateCustomerName = document.getElementById("updateCustomerName").value.trim();
            let updateMobileNumber = document.getElementById("updateMobileNumber").value.trim();

            if (!updateCustomerName || !updateMobileNumber) {
                Swal.fire("Error!", "All fields are required, and values must be valid.", "error");
                return false;
            }

            customersArray[index] = { 
                id: customer.id,
                name: updateCustomerName, 
                mobileNumber: updateMobileNumber 
            };

            saveItemsToLocalStorage();
            loadAllCustomers();

            Swal.fire("Success!", "Customer details have been updated.", "success");
        }
    });
}


// ---------------------- Delete Customer --------------------------

function deleteCustomer(index) {
    customersArray.splice(index, 1);  
    saveItemsToLocalStorage();
    loadAllCustomers(); 
}


// ---------------------- Search Customer --------------------------

function searchCustomer() {
    const searchQuery = document.getElementById("txtSearchBar").value.trim().toLowerCase();
    const filteredCustomers = customersArray.filter(customer => 
        customer.name.toLowerCase().includes(searchQuery)
    );
    loadAllCustomers(filteredCustomers); 
}

function loadAllCustomers(customersToDisplay = customersArray) {
    let scrollableDiv = document.getElementById("customerList");

    if (customersToDisplay.length === 0) {
        scrollableDiv.innerHTML = `<p class="text-center mt-3">No customers found.</p>`;
        return;
    }

    let tableHTML = `
        <table class="table table-bordered table-striped table-light mx-auto" style="width:95%">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th class="actions-column">Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    customersToDisplay.forEach((customer, index) => {
        tableHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${customer.name}</td>
                <td>${customer.mobileNumber}</td>
                <td class="actions-column">
                    <button class="btn btn-primary btn-sm" onclick="updateCustomer(${index})">
                        Update
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCustomer(${index})">
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
