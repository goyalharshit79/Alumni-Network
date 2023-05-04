import React from "react";

function LogIn(props) {
  function handleLogin(event) {
    const address = "http://localhost:8000";
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const reqData = {
      email: data.get("email"),
      password: data.get("password"),
    };
    fetch(address + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqData),
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.msg === "900") {
          props.loggedIn(data.email);
          props.closeSignin();
        } else if (data.msg === "902") {
          props.loggedIn(data.email);
          props.firstLogin();
          props.closeSignin();
        } else if (data.msg === "901") {
          props.handleBadLogin();
        }
      })
      .catch((err) => console.log(err));
  }
  return (
    <div
      className="modal bg-transparent text-color-sec d-block py-5"
      tabIndex="-1"
      role="dialog"
      id="modalSignin"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content bg-color rounded-4 shadow">
          <div className="modal-header p-5 pb-4 border-bottom-0">
            <h2 className="fw-bold mb-0 text-color-main">Log In</h2>
            <button
              type="button"
              className="btn-close close"
              aria-label="Close"
              onClick={props.closeSignin}
            ></button>
          </div>

          <div className="modal-body p-5 pt-0">
            <form onSubmit={handleLogin} method="post">
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control rounded-3 my-input"
                  id="floatingInput"
                  name="email"
                  placeholder="name@example.com"
                  required
                />
                <label htmlFor="floatingInput">Email address</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control rounded-3 my-input"
                  id="floatingPassword"
                  name="password"
                  placeholder="Password"
                  required
                />
                <label htmlFor="floatingPassword">Password</label>
              </div>
              <button
                className=" w-100 btn btn-lg rounded-5 btn-color-1"
                type="submit"
              >
                Log In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
