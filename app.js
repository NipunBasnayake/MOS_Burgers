// ----------------- USER DETAILS ARRAY -----------------

let userDetailsArray = [
    { userId: "admin", password: "Test@123" },
    { userId: "user", password: "1234" }
]

// ----------------- LOGIN -----------------

function login() {
    let txtUserId = $("#txtUserId").val();
    let txtPassword = $("#txtPassword").val();

    if (!txtUserId || !txtPassword) {
        Swal.fire({
            icon: "info",
            title: "Missing Information",
            text: "Please enter both UserID and Password",
            customClass: {
                popup: 'custom-swal',
                confirmButton: 'custom-btn' 
            }
        });
        return;
    }

    let loginSuccess = false;

    userDetailsArray.forEach(element => {
        if (element.userId === txtUserId) {
            if (element.password === txtPassword) {
                loginSuccess = true;
            }
        }
    });

    if (!loginSuccess) {
        Swal.fire({
            icon: "error",
            title: "Login Unsuccess",
            text: "Please check your UserID & Password",
            customClass: {
                popup: 'custom-swal',
                confirmButton: 'custom-btn' 
            }
        });
    }else if (loginSuccess) {
        window.location.href ="home.html";
    }
}




// let orderHistory = [
//     {
//         orderId: 1,
//         customer: "John Doe",
//         items: [
//             { itemName: "Green Chilli Burger", price: 1350, qty: 2 },
//             { itemName: "Pepsi", price: 180, qty: 1 }
//         ],
//         discount: 10,
//         totalAmount: 3240,
//         finalAmount: 2916,
//         orderDate: "2024-12-16 09:15:00"
//     },
//     {
//         orderId: 2,
//         customer: "Jane Smith",
//         items: [
//             { itemName: "Turkey Burger", price: 1500, qty: 1 },
//             { itemName: "Ice Cream", price: 600, qty: 2 }
//         ],
//         discount: 5,
//         totalAmount: 2700,
//         finalAmount: 2565,
//         orderDate: "2024-12-16 09:45:00"
//     },
//     {
//         orderId: 3,
//         customer: "Alice Johnson",
//         items: [
//             { itemName: "BBQ Burger", price: 1400, qty: 3 },
//             { itemName: "Sprite", price: 150, qty: 1 }
//         ],
//         discount: 0,
//         totalAmount: 4350,
//         finalAmount: 4350,
//         orderDate: "2024-12-16 10:05:00"
//     },
//     {
//         orderId: 4,
//         customer: "Bob Brown",
//         items: [
//             { itemName: "Chicken Burger", price: 1200, qty: 2 },
//             { itemName: "Pepsi", price: 180, qty: 1 }
//         ],
//         discount: 15,
//         totalAmount: 2580,
//         finalAmount: 2183,
//         orderDate: "2024-12-15 10:30:00"
//     },
//     {
//         orderId: 5,
//         customer: "Eve White",
//         items: [
//             { itemName: "Cheese Burger", price: 1200, qty: 1 },
//             { itemName: "Fruit Salad", price: 700, qty: 1 }
//         ],
//         discount: 0,
//         totalAmount: 1900,
//         finalAmount: 1900,
//         orderDate: "2024-12-15 11:00:00"
//     },
//     {
//         orderId: 6,
//         customer: "Charlie Green",
//         items: [
//             { itemName: "Mushroom Burger", price: 1300, qty: 2 },
//             { itemName: "Coca Cola", price: 180, qty: 2 }
//         ],
//         discount: 10,
//         totalAmount: 2960,
//         finalAmount: 2664,
//         orderDate: "2024-12-14 11:30:00"
//     },
//     {
//         orderId: 7,
//         customer: "David Black",
//         items: [
//             { itemName: "Veggie Burger", price: 1000, qty: 3 },
//             { itemName: "Ice Cream", price: 600, qty: 1 }
//         ],
//         discount: 5,
//         totalAmount: 3600,
//         finalAmount: 3420,
//         orderDate: "2024-12-14 12:00:00"
//     },
//     {
//         orderId: 8,
//         customer: "Grace Blue",
//         items: [
//             { itemName: "Butter Burger", price: 1400, qty: 2 },
//             { itemName: "Pepsi", price: 180, qty: 3 }
//         ],
//         discount: 20,
//         totalAmount: 3960,
//         finalAmount: 3168,
//         orderDate: "2024-12-14 12:30:00"
//     },
//     {
//         orderId: 9,
//         customer: "Henry Silver",
//         items: [
//             { itemName: "Coca Cola", price: 180, qty: 4 },
//             { itemName: "Cheese Burger", price: 1200, qty: 2 }
//         ],
//         discount: 0,
//         totalAmount: 3960,
//         finalAmount: 3960,
//         orderDate: "2024-12-14 13:00:00"
//     },
//     {
//         orderId: 10,
//         customer: "Isla Red",
//         items: [
//             { itemName: "Bison Burger", price: 1600, qty: 1 },
//             { itemName: "Watalappam", price: 700, qty: 2 }
//         ],
//         discount: 10,
//         totalAmount: 4000,
//         finalAmount: 3600,
//         orderDate: "2024-12-14 13:30:00"
//     }
// ];

// function saveOrderHistoryToLocalStorage() {
//     localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
// }

// saveOrderHistoryToLocalStorage();