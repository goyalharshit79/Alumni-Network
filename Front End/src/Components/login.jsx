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
        }
      })
      .catch((err) => console.log(err));
  }
  return (
    <div
      className="modal bg-transparent d-block py-5"
      tabIndex="-1"
      role="dialog"
      id="modalSignin"
    >
      <div className="modal-dialog" role="document">
        <div className={"modal-content rounded-4 shadow bg-" + props.theme}>
          <div className="modal-header p-5 pb-4 border-bottom-0">
            <h2 className={"fw-bold mb-0 text-" + props.color}>Log In</h2>
            <button
              type="button"
              className={"btn-close btn-close-" + props.color}
              aria-label="Close"
              onClick={props.closeSignin}
            ></button>
          </div>

          <div className="modal-body p-5 pt-0">
            <form onSubmit={handleLogin} method="post">
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control rounded-3"
                  id="floatingInput"
                  name="email"
                  placeholder="name@example.com"
                />
                <label htmlFor="floatingInput">Email address</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="password"
                  className="form-control rounded-3"
                  id="floatingPassword"
                  name="password"
                  placeholder="Password"
                />
                <label htmlFor="floatingPassword">Password</label>
              </div>
              <button
                className="w-100 mb-2 btn btn-lg rounded-3 btn-outline-info"
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
