import React, { useState } from "react";

function SignUp(props) {
  const [showingPassword, setShowingPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [userExists, setUserExists] = useState(false);
  function handleSignup(event) {
    event.preventDefault();
    validate() ? doSignUp(event) : console.log("dont bro");
  }
  function doSignUp(event) {
    const address = "http://localhost:8000";
    const data = new FormData(event.currentTarget);
    const reqData = {
      fname: data.get("floatingFname"),
      lname: data.get("floatingLname"),
      email: data.get("floatingEmail"),
      user: data.get("floatingUserType"),
      password: data.get("floatingConfirmPassword"),
      course: data.get("floatingCourse"),
      gradYear: data.get("floatingYear"),
    };
    // console.log(reqData);
    fetch(address + "/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqData),
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.msg === "900") {
          props.closeSignup(props.theme);
        } else if (data.msg === "901") {
          setUserExists(true);
        }
      })
      .catch((err) => console.log(err));
  }

  function validate() {
    const [emptyElements, filledElements] = isEmpty();
    invalid(emptyElements);
    notInvalid(filledElements);
    return passwordsMatch ? (emptyElements.length === 0 ? true : false) : false;
  }

  function isEmpty() {
    const empty = [];
    const filledElements = [];
    const inputs = document.getElementsByClassName("form-control");
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].value === "") {
        empty.push(inputs[i].id);
      } else {
        filledElements.push(inputs[i].id);
      }
    }
    return [empty, filledElements];
  }
  function valid(id) {
    id.forEach((element) => {
      document.getElementById(element).classList.add("is-valid");
      document.getElementById(element).classList.remove("is-invalid");
      if (element === "floatingConfirmPassword") {
        setPasswordsMatch(true);
      }
    });
  }
  function notInvalid(id) {
    id.forEach((element) => {
      if (element !== "floatingConfirmPassword") {
        document.getElementById(element).classList.remove("is-invalid");
      }
    });
  }
  function invalid(id) {
    id.forEach((element) => {
      document.getElementById(element).classList.add("is-invalid");
      document.getElementById(element).classList.remove("is-valid");
      if (element === "floatingConfirmPassword") {
        setPasswordsMatch(false);
      }
    });
  }
  function confirmPassword() {
    document.getElementById("floatingConfirmPassword").value ===
    document.getElementById("floatingPassword").value
      ? valid(["floatingConfirmPassword", "floatingPassword"])
      : invalid(["floatingConfirmPassword"]);
  }
  function toggleShowPassword() {
    showingPassword ? stopShowingPassword() : showPassword();
  }
  function showPassword() {
    document.getElementById("floatingPassword").setAttribute("type", "text");
    document
      .getElementById("floatingConfirmPassword")
      .setAttribute("type", "text");
    setShowingPassword(true);
  }
  function stopShowingPassword() {
    document
      .getElementById("floatingPassword")
      .setAttribute("type", "password");
    document
      .getElementById("floatingConfirmPassword")
      .setAttribute("type", "password");
    setShowingPassword(false);
  }

  return (
    <div
      className="modal bg-transparent d-block pt-4"
      tabIndex="-1"
      role="dialog"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content bg-color rounded-4 shadow">
          <div className="modal-header p-5 pb-4 border-bottom-0">
            <h2 className="fw-bold text-color-main mb-0 ">Sign Up</h2>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={props.closeSignup}
            ></button>
          </div>
          <div className="modal-body p-5 pt-0">
            <form onSubmit={handleSignup} id="signupForm">
              <div className="row">
                <div className="col-md-6 form-floating mb-3 left-padding">
                  <input
                    type="text"
                    className="form-control rounded-3 my-input"
                    id="floatingFname"
                    name="floatingFname"
                    placeholder="First Name"
                  />
                  <label htmlFor="floatingFname">First Name</label>
                </div>
                <div className="col-md-6 form-floating mb-3 left-padding">
                  <input
                    type="text"
                    className="form-control rounded-3 my-input"
                    id="floatingLname"
                    name="floatingLname"
                    placeholder="Last Name"
                  />
                  <label htmlFor="floatingLname">Last Name</label>
                </div>
                <div className="form-floating mb-3 left-padding">
                  <input
                    type="email"
                    className="form-control rounded-3 my-input"
                    id="floatingEmail"
                    name="floatingEmail"
                    placeholder="Email address"
                  />
                  <label htmlFor="floatingEmail">Email address</label>

                  {userExists ? (
                    <div className="problem-msg">
                      User with this email already exists!
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
                <div className="form-floating mb-3 left-padding">
                  <select
                    className="form-control form-select rounded-3 my-input"
                    id="floatingUserType"
                    name="floatingUserType"
                  >
                    <option value="">Select User Type</option>
                    <option value="Student">Student</option>
                    <option value="Alumni">Alumni</option>
                    <option value="Teacher">Teacher</option>
                  </select>
                  <label htmlFor="floatingUserType">Select User Type</label>
                </div>

                <div className="form-floating mb-3 left-padding">
                  <input
                    type="password"
                    className="form-control rounded-3 my-input"
                    id="floatingPassword"
                    placeholder="Password"
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>
                <div className="form-floating mb-3 left-padding">
                  <input
                    type="password"
                    className="form-control rounded-3 my-input"
                    id="floatingConfirmPassword"
                    name="floatingConfirmPassword"
                    placeholder="Confirm Password"
                    onChange={confirmPassword}
                  />
                  <label htmlFor="floatingConfirmPassword">
                    Confirm Password
                  </label>
                </div>
                <div className="form-floating mb-3 left-padding">
                  <input
                    className="form-check-input my-input"
                    type="checkbox"
                    id="show-password"
                    onClick={toggleShowPassword}
                  />
                  <label
                    htmlFor="show-password"
                    className="p-0 show-password text-color-sec"
                  >
                    Show Password
                  </label>
                </div>

                <button
                  className="btn btn-lg rounded-5 btn-color-1"
                  type="submit"
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SignUp;
