import React, { useEffect } from "react";
import $ from "jquery";

function Details(props) {
  useEffect(() => {
    setDimensions();
  });

  const setDimensions = () => {
    $("#my-container").outerHeight($("body").innerHeight());
  };
  return (
    <div
      className="scroll-enable bg-color text-center position-relative"
      id="my-container"
    >
      <div className="position-absolute top-50 start-50 translate-middle">
        <h1 className="display-5 fw-bold mb-4 text-color-main">
          Alumni Network
        </h1>
        <p className="fs-5 mb-4 text-color-sec">
          This is a place for Alumni to connect back with their Alma Mater. Here
          students can connect with their predecesors and learn from their
          experiences. Also this will allow the institute to search amongst the
          large number of alumni.
        </p>
        <div className="gap-4 d-sm-flex justify-content-sm-center">
          <button
            type="button"
            className="btn btn-color-1 btn-lg px-5 rounded-5"
            onClick={props.signupShow}
          >
            Sign Up
          </button>
          <button
            type="button"
            className="btn btn-lg px-5 rounded-5 btn-color-1"
            onClick={props.loginShow}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
export default Details;
