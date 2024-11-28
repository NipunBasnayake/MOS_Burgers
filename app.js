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