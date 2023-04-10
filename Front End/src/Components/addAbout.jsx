import React from "react";

function AddAbout(props) {
  function handleAddAbout(e) {
    e.preventDefault();
    const address = "http://localhost:8000";
    const data = new FormData(e.currentTarget);
    const reqData = {
      about: data.get("about"),
      email: props.cookies.email,
    };
    fetch(address + "/add-about", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqData),
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        props.closeAddAbout();
        props.updateDetails();
      });
  }

  return (
    <>
      <div
        className="modal bg-transparent d-block pt-4"
        tabIndex="-1"
        role="dialog"
        id="add-about-modal"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content rounded-4 shadow bg-color">
            <div className="modal-header p-5 pb-4 border-bottom-0">
              <h2 className="mb-0 text-color-main">About Me</h2>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={props.closeAddAbout}
              ></button>
            </div>
            <div className="modal-body p-5 pt-0">
              <form onSubmit={handleAddAbout}>
                <div className="form-floating mb-3">
                  <textarea
                    defaultValue={props.userDetails.about}
                    name="about"
                    id="about"
                    className="form-control my-input rounded-3"
                    placeholder="About"
                  ></textarea>
                  <label htmlFor="about">About</label>
                </div>
                <div className="row">
                  <button
                    className="w-100 mb-2 btn btn-lg rounded-3 btn-color-1"
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
    </>
  );
}
export default AddAbout;
