import React, { useState, useEffect } from "react";
function AddSection(props) {
  const [additionDetailReqd, setAdditionalDetailReqd] = useState("");
  useEffect(() => {
    if (!additionDetailReqd) {
      checkTitle();
    }
  });
  useEffect(() => {
    props.sectionFrom === "edit"
      ? (document.getElementById("title").value = props.whichSection)
      : (document.getElementById("title").defaultValue = "");
  });
  function handleAddSection(e) {
    const address = "http://localhost:8000";
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get("value") === "") {
      document.getElementById("value").classList.add("is-invalid");
    } else {
      document.getElementById("value").classList.add("is-valid");
      const reqPayload = {
        email: props.userDetails.email,
        title: data.get("title"),
        value: data.get("value"),
        from: props.sectionFrom,
      };

      fetch(address + "/add-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqPayload),
        mode: "cors",
      })
        .then((response) => response.json())
        .then((data) => {
          props.updateDetails();
          props.closeAddSection();
        })
        .catch((err) => console.log(err));
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  function checkTitle(e) {
    let title;
    let titleFound = false;
    if (e) {
      title = e.target.value;
    } else {
      title = props.whichSection;
    }
    props.userDetails.additionalDetails.forEach((detail) => {
      const key = Object.keys(detail)[0];
      if (key === title) {
        titleFound = true;
        console.log("title: ", title);
        console.log(detail[key]);
        setAdditionalDetailReqd(detail[key]);
      }
    });
    if (!titleFound) {
      setAdditionalDetailReqd("");
    }
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
              <h2 className="fw-bold mb-0 text-color-main">
                Add any section you like
              </h2>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={props.closeAddSection}
              ></button>
            </div>
            <div className="modal-body p-5 pt-0">
              <form onSubmit={handleAddSection}>
                <div className="form-floating mb-3">
                  <input
                    className="fw-bold form-control rounded-3 my-input"
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Title"
                    onChange={checkTitle}
                  />
                  <label htmlFor="title">Title</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    defaultValue={
                      props.sectionFrom === "edit"
                        ? additionDetailReqd
                        : additionDetailReqd
                    }
                    name="value"
                    id="value"
                    className="form-control rounded-3 my-input"
                    placeholder="About"
                  />
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
export default AddSection;
