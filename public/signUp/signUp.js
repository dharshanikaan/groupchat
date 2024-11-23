async function handerFormSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);
  
    const signUpDetails = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      password: form.get("password"),
    };
   console.log(signUpDetails);
    try {
      if (
        signUpDetails.name == "" ||
        signUpDetails.email == "" ||
        signUpDetails.phone == "" ||
        signUpDetails.password == ""
      ) {
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
      await axios.post("http://localhost:3000/api/signup", signUpDetails);
  
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        text: "Account created successfully",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (err) {
      console.log("Error:", err.message);
      if (err.response.status == 422) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          text: "Email already exists",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    }
  
    // clear form fields
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("phone").value = "";
  }