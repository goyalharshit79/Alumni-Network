import React from "react";

export default function Alert(props) {
  return (
    <>
      <div
        className={
          "alert my-message alert-dismissible fade show alert-" + props.type
        }
        role="alert"
      >
        {props.message}
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
          onClick={props.closeAlert}
        ></button>
      </div>
    </>
  );
}
