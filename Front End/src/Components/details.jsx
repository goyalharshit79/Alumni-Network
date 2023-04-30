import React from "react";

export default function Det(props) {
  return (
    <div className="landing-container">
      <div className="image-container">
        <div className="image-wrapper">
          <div className="inside-container">
            <img src="try.jpg" className="landing-image" alt="" />
          </div>
        </div>
      </div>
      <div className="details-container">
        <div className="details-wrapper">
          <h1 className="fw-bold mb-4 text-color-main">Alumni Network</h1>
          <p className="fs-5 mb-4 text-color-sec">
            This is a place for Alumni to connect back with their Alma Mater.
            Here students can connect with their predecesors and learn from
            their experiences. Also this will allow the institute to search
            amongst the large number of alumni.
          </p>
          <div className="details-buttons">
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
    </div>
  );
}
