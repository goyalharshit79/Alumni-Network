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
      className={
        "scroll-enable bg-" +
        props.theme +
        " text-secondary px-4 py-5 text-center position-relative"
      }
      id="my-container"
    >
      <div className="position-absolute top-50 start-50 translate-middle">
        <h1
          className={"display-5 fw-bold heading pb-1 mb-4 text-" + props.color}
        >
          Alumni Network
        </h1>
        <div className="col-lg-10 mx-auto">
          <p className="fs-5 mb-4">
            This is a place for Alumni to connect back with their Alma Mater.
            Here students can connect with their predecesors and learn from
            their experiences. Also this will allow the institute to search
            amongst the large number of alumni.
          </p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <button
              type="button"
              className="btn btn-outline-info btn-lg px-4 me-sm-3 fw-bold"
              onClick={props.signupShow}
            >
              Sign Up
            </button>
            <button
              type="button"
              className={"btn btn-lg px-4 btn-outline-" + props.btnTheme}
              onClick={props.loginShow}
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Details;
