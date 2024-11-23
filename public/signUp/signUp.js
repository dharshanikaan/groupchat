async function handerFormSubmit(e) {
  e.preventDefault();  // Prevent the default form submission

  // Get form data
  const form = new FormData(e.target);
  const signUpDetails = {
    name: form.get("name"),
    email: form.get("email"),
    phone: form.get("phone"),
    password: form.get("password"),
  };

  // Validate form data
  if (signUpDetails.name == "" || signUpDetails.email == "" || signUpDetails.phone == "" || signUpDetails.password == "") {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      text: "Please fill all the fields",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
    return;
  }

  try {
    // Make the POST request to the backend to create the user
    const response = await axios.post("http://localhost:3000/api/signup", signUpDetails);

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      text: "Account created successfully",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    }).then(() => {
      window.location.href = "/login";  // Redirect to login page
    });

  } catch (err) {
    console.log("Error:", err.message);
    if (err.response && err.response.status === 422) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        text: "Email already exists",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } else {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        text: "Something went wrong",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  }

  // Clear form fields after submission
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("password").value = "";
}
