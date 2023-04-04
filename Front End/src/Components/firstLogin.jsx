import React, { useEffect, useState } from "react";
import _ from "lodash";
function FirstLogin(props) {
  const [keys, setKeys] = useState([]);
  useEffect(() => {
    if (keys.length === 0) {
      const address = "http://localhost:8000";
      fetch(address + "/firstLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(props.user),
        mode: "cors",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.msg === "900") {
            filterKeys(data.schema);
          }
        });
    }
  });
  function filterKeys(schema) {
    var keysRecd = Object.keys(schema);
    keysRecd = keysRecd.filter((key) => {
      return (
        key !== "_id" &&
        key !== "__v" &&
        key !== "email" &&
        key !== "about" &&
        key !== "additionalDetails"
      );
    });

    setKeys(keysRecd);
  }
  function updateUserDetails(e) {
    e.preventDefault();
    const address = "http://localhost:8000";
    const data = new FormData(e.currentTarget);
    const reqData = keys.map((key) => {
      return { [key]: data.get(key) };
    });
    reqData.push(props.user);

    fetch(address + "/updateDetails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqData),
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        props.updateDetails();
        props.closeFirstLogin();
      });
  }
  return (
    <div
      className="modal bg-transparent d-block pt-4"
      tabIndex="-1"
      role="dialog"
      id="edit-details-modal"
    >
      <div className="modal-dialog" role="document">
        <div className={"modal-content rounded-4 shadow bg-" + props.theme}>
          <div className="modal-header p-5 pb-4 border-bottom-0">
            <h2 className={"fw-bold mb-0 text-" + props.color}>
              {props.from === "firstLogin"
                ? "Please fill the following details to continue"
                : "Edit User Details"}
            </h2>
            <button
              type="button"
              className={"btn-close btn-close-" + props.color}
              aria-label="Close"
              onClick={props.closeFirstLogin}
            ></button>
          </div>
          <div className="modal-body p-5 pt-0">
            <form id="signupForm" onSubmit={updateUserDetails}>
              <div className="row">
                {keys.map((key) => {
                  return (
                    <div className="col-md-12 form-floating mb-3 left-padding">
                      <input
                        defaultValue={props.userDetails[key]}
                        className="form-control rounded-3 "
                        id={key}
                        name={key}
                        placeholder={key}
                      />
                      <label htmlFor={key}>{_.startCase(key)}</label>
                    </div>
                  );
                })}
                <button
                  className="w-100 mb-2 btn btn-lg rounded-3 btn-outline-info"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FirstLogin;
