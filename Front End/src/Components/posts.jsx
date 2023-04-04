import React from "react";
import _ from "lodash";

function Post(props) {
  return (
    <div>
      {props.user.user === "Teacher" ? (
        <button className=" add-post-btn btn btn-outline-info" type="submit">
          +
        </button>
      ) : (
        <></>
      )}

      <div className="row mb-5">
        <div className="col-md-3"></div>
        <div className="card p-3 post col-md-6">
          <div className="row">
            <div className="col-sm-12 h4">
              <img
                alt="Your"
                src="debate4.jpg"
                className={"img photo-post  border-" + props.theme}
              />
              <span className="name-post">
                {_.startCase(props.user.fName + " " + props.user.lName)}
              </span>
            </div>
            <div className="col-sm-12">
              <p>About the post</p>
            </div>
            <img
              className="col-sm-12 post-image"
              src="try.jpg"
              alt="imageHere"
            />
            <div className="col-sm-12">Comments Section</div>
          </div>
        </div>
        <div className="col-md-3"></div>
      </div>
    </div>
  );
}

export default Post;
