// ----------------- LOGIN -----------------

function login() {
    let txtUserEmail = $("#txtUserId").val();
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

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "name": "",
        "email": txtUserEmail,
        "password": txtPassword
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://localhost:8080/user/login", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            if (result == "true") {
                window.location.href = "home.html";
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Login Unsuccess",
                    text: "Please check your UserID & Password",
                    customClass: {
                        popup: 'custom-swal',
                        confirmButton: 'custom-btn'
                    }
                });
            }
        })
        
}

// ----------------------------- Items Array to Local Storage ---------------------------------

// let itemsList = [
//     {
//         id: 1,
//         itemName: "Green Chilli Burger",
//         price: 1350,
//         qty: 15,
//         type: "Burger",
//         image: "greenChilliCheeseBurger.jpg",
//         expireDate: "12/12/2024"
//     },
//     {
//         id: 2,
//         itemName: "Pudding",
//         price: 500,
//         qty: 25,
//         type: "Dessert",
//         image: "pudding.jpg",
//         expireDate: "01/01/2025"
//     },
//     {
//         id: 3,
//         itemName: "Turkey Burger",
//         price: 1500,
//         qty: 10,
//         type: "Burger",
//         image: "turkeyBurger.jpg",
//         expireDate: "02/15/2025"
//     },
//     {
//         id: 4,
//         itemName: "Sprite",
//         price: 150,
//         qty: 50,
//         type: "Beverage",
//         image: "sprite.jpg",
//         expireDate: "03/01/2025"
//     },
//     {
//         id: 5,
//         itemName: "Ice Cream",
//         price: 600,
//         qty: 20,
//         type: "Dessert",
//         image: "iceCream.jpg",
//         expireDate: "04/10/2025"
//     },
//     {
//         id: 6,
//         itemName: "Chicken Burger",
//         price: 1200,
//         qty: 18,
//         type: "Burger",
//         image: "chickenBurger.jpg",
//         expireDate: "05/20/2025"
//     },
//     {
//         id: 7,
//         itemName: "Pepsi",
//         price: 180,
//         qty: 40,
//         type: "Beverage",
//         image: "pepsi.jpg",
//         expireDate: "06/15/2025"
//     },
//     {
//         id: 8,
//         itemName: "BBQ Burger",
//         price: 1400,
//         qty: 12,
//         type: "Burger",
//         image: "bbqBurger.jpg",
//         expireDate: "07/25/2025"
//     },
//     {
//         id: 9,
//         itemName: "Watalappam",
//         price: 700,
//         qty: 8,
//         type: "Dessert",
//         image: "watalappam.jpg",
//         expireDate: "08/30/2025"
//     },
//     {
//         id: 10,
//         itemName: "Cheese Burger",
//         price: 1200,
//         qty: 20,
//         type: "Burger",
//         image: "cheeseBurger.jpg",
//         expireDate: "09/15/2025"
//     },
//     {
//         id: 11,
//         itemName: "Fruit Salad",
//         price: 700,
//         qty: 15,
//         type: "Dessert",
//         image: "fruitSalad.jpg",
//         expireDate: "10/01/2025"
//     },
//     {
//         id: 12,
//         itemName: "Butter Burger",
//         price: 1400,
//         qty: 10,
//         type: "Burger",
//         image: "butterBurger.jpg",
//         expireDate: "11/05/2025"
//     },
//     {
//         id: 13,
//         itemName: "Coca Cola",
//         price: 180,
//         qty: 35,
//         type: "Beverage",
//         image: "cocaCola.jpg",
//         expireDate: "12/31/2025"
//     },
//     {
//         id: 14,
//         itemName: "Veggie Burger",
//         price: 1000,
//         qty: 12,
//         type: "Burger",
//         image: "veggieBurger.jpg",
//         expireDate: "01/10/2026"
//     },
//     {
//         id: 15,
//         itemName: "Mushroom Burger",
//         price: 1300,
//         qty: 8,
//         type: "Burger",
//         image: "mushroomBurger.jpg",
//         expireDate: "02/14/2026"
//     },
//     {
//         id: 16,
//         itemName: "Kik Cola",
//         price: 150,
//         qty: 40,
//         type: "Beverage",
//         image: "kikCola.jpg",
//         expireDate: "03/20/2026"
//     },
//     {
//         id: 17,
//         itemName: "Burma Burger",
//         price: 1400,
//         qty: 15,
//         type: "Burger",
//         image: "burmaBurger.jpg",
//         expireDate: "04/25/2026"
//     },
//     {
//         id: 18,
//         "itemName": "Bison Burger",
//         price: 1600,
//         qty: 10,
//         type: "Burger",
//         image: "bisonBurger.jpg",
//         expireDate: "05/15/2026"
//     },
//     {
//         id: 19,
//         itemName: "Elk Burger",
//         price: 1800,
//         qty: 5,
//         type: "Burger",
//         image: "elkBurger.jpg",
//         expireDate: "06/30/2026"
//     }
// ]

// function saveItemsToLocalStorage() {
//     localStorage.setItem("itemsList", JSON.stringify(itemsList));
// }

// saveItemsToLocalStorage();



// ----------------------------- order History to Local Storage ---------------------------------

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
//         orderDate: "2024-12-16 14:30:00"
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
//         orderDate: "2024-12-16 16:45:00"
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
//         orderDate: "2024-12-17 12:10:00"
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
//         orderDate: "2024-12-17 18:20:00"
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
//         orderDate: "2024-12-17 13:00:00"
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
//         orderDate: "2024-12-18 15:40:00"
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
//         orderDate: "2024-12-18 17:25:00"
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
//         orderDate: "2024-12-19 19:00:00"
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
//         orderDate: "2024-12-19 11:50:00"
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
//         orderDate: "2024-12-19 14:30:00"
//     }
// ];

// function saveOrderHistoryToLocalStorage() {
//     localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
// }

// saveOrderHistoryToLocalStorage();
