async function handerFormSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
  
    const loginDetails = {
      email: form.get("email"),
      password: form.get("password"),
    };
  
    try {
      if (loginDetails.email == "" || loginDetails.password == "") {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          text: "Please fill all the fields",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        return;
      }
  
      const response = await axios.post("http://localhost:3000/api/login", loginDetails);
      
      // Store the JWT token in localStorage
      localStorage.setItem("token", response.data.token);
      window.location.href = "/home";  // Redirect to home page after successful login
  
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          text: "Invalid email or password",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
      if (error.response && error.response.status === 404) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          text: "User not found, please sign up",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    }
  
    // Clear form fields after submission
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
  }
  