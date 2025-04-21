function login() {
    let txtUserEmail = $("#txtUserId").val();
    let txtPassword = $("#txtPassword").val();
  
    if (!txtUserEmail || !txtPassword) {
      Swal.fire({
        icon: "info",
        title: "Missing Information",
        text: "Please enter both Email and Password",
        customClass: {
          popup: "custom-swal",
          confirmButton: "custom-btn",
        },
      });
      return;
    }
  
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    const raw = JSON.stringify({
      name: "",
      email: txtUserEmail,
      password: txtPassword,
    });
  
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
  
    fetch("http://localhost:8080/user/login", requestOptions)
      .then((response) => response.json())
      .then((userData) => {
        console.log(userData);
  
        if (userData && userData.id) {
          localStorage.setItem("currentUser", JSON.stringify(userData));
          
          window.location.href = "home.html";
        } else {
          Swal.fire({
            icon: "error",
            title: "Login Unsuccessful",
            text: "Please check your Email & Password",
            customClass: {
              popup: "custom-swal",
              confirmButton: "custom-btn",
            },
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire({
          icon: "error",
          title: "Connection Error",
          text: "Unable to connect to the server. Please try again later.",
          customClass: {
            popup: "custom-swal",
            confirmButton: "custom-btn",
          },
        });
      });
  }