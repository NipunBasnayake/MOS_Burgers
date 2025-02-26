// -------------------------- State Management --------------------------
let customersArray = [];

// -------------------------- DOM Elements --------------------------
const customerList = document.getElementById("customerList");
const txtSearchBar = document.getElementById("txtSearchBar");

// -------------------------- Load Customer Data from DB --------------------------
async function loadCustomersFromDB() {
    try {
        const response = await fetch("http://localhost:8080/customer/all");
        if (!response.ok) throw new Error("Failed to fetch customers");
        customersArray = await response.json();
        populateCustomerTable(customersArray);
    } catch (error) {
        console.error("Error loading customers:", error);
        customerList.innerHTML = `<p class="text-center mt-3">Failed to load customers. Please try again later.</p>`;
    }
}

// -------------------------- Add Customer to DB --------------------------
async function addCustomer() {
    const { value: formValues } = await Swal.fire({
        title: "Add Customer",
        html: `
            <input type="text" id="addCustomerName" class="swal2-input" placeholder="Customer Name" required>
            <input type="text" id="addMobileNumber" class="swal2-input" placeholder="Mobile Number" required>
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
            Swal.fire("Success!", "Customer has been added.", "success");
            await loadCustomersFromDB();
        } catch (error) {
            console.error("Error adding customer:", error);
            Swal.fire("Error!", "Failed to add customer. Try again.", "error");
        }
    }
}

// -------------------------- Update Customer --------------------------
async function updateCustomer(id) {
    const customer = customersArray.find(c => c.id === id);
    if (!customer) {
        Swal.fire("Error!", "Customer not found.", "error");
        return;
    }

    const { value: formValues } = await Swal.fire({
        title: "Update Customer",
        html: `
            <input type="text" id="updateCustomerName" class="swal2-input" placeholder="Customer Name" value="${customer.name}">
            <input type="text" id="updateMobileNumber" class="swal2-input" placeholder="Mobile Number" value="${customer.mobile}">
        `,
        showCancelButton: true,
        confirmButtonText: "Update Customer",
        preConfirm: () => {
            const name = document.getElementById("updateCustomerName").value.trim();
            const mobile = document.getElementById("updateMobileNumber").value.trim();
            if (!name || !mobile) {
                Swal.showValidationMessage("All fields are required");
                return false;
            }
            return { name, mobile };
        }
    });

    if (formValues) {
        try {
            const response = await fetch("http://localhost:8080/customer/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, ...formValues })
            });
            if (!response.ok) throw new Error("Failed to update customer");
            Swal.fire("Success!", "Customer details have been updated.", "success");
            await loadCustomersFromDB();
        } catch (error) {
            console.error("Error updating customer:", error);
            Swal.fire("Error!", "Failed to update customer. Please try again.", "error");
        }
    }
}

// -------------------------- Delete Customer --------------------------
async function deleteCustomer(id) {
    const confirmResult = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
    });

    if (confirmResult.isConfirmed) {
        try {
            const response = await fetch(`http://localhost:8080/customer/delete/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete customer");
            Swal.fire("Deleted!", "Customer has been deleted.", "success");
            await loadCustomersFromDB();
        } catch (error) {
            console.error("Error deleting customer:", error);
            Swal.fire("Error!", "Failed to delete customer. Please try again.", "error");
        }
    }
}

// -------------------------- Search Customer --------------------------
function searchCustomer() {
    const searchQuery = txtSearchBar.value.trim().toLowerCase();
    const filteredCustomers = customersArray.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery)
    );
    populateCustomerTable(filteredCustomers);
}

// -------------------------- Populate Customer Table --------------------------
function populateCustomerTable(customers = customersArray) {
    if (!customerList) return;

    if (customers.length === 0) {
        customerList.innerHTML = `<p class="text-center mt-3">No customers found.</p>`;
        return;
    }

    const tableHTML = `
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
                ${customers.map((customer, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${customer.name}</td>
                        <td>${customer.mobile}</td>
                        <td class="actions-column">
                            <button class="btn btn-primary btn-sm" onclick="updateCustomer(${customer.id})">
                                Update
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="deleteCustomer(${customer.id})">
                                Delete
                            </button>
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;

    customerList.innerHTML = tableHTML;
}

// -------------------------- Event Listeners --------------------------
txtSearchBar.addEventListener("input", searchCustomer);

// -------------------------- Initialization --------------------------
loadCustomersFromDB();