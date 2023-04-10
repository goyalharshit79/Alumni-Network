import React, { useState } from "react";
import _ from "lodash";
import Carousel from "./carousel";

function Post(props) {
  const [profilePics, setProfilePics] = useState();

  function getPhoto(post) {
    const address = "http://localhost:8000";
    const reqPayload = {
      email: post.email,
    };
    fetch(address + "/get-user-pic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqPayload),
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.msg === "900") {
          setProfilePics((prev) => {
            return {
              ...prev,
              [post.postNumber]: data.pic,
            };
          });
        }
      })
      .catch((err) => console.log(err));
  }
  console.log(profilePics);
  return (
    <>
      {props.posts.map((post) => {
        return profilePics ? (
          <div className="row mb-5">
            <div className="col-md-3"></div>

            <div className="card p-3 post bg-color col-md-6">
              <div className="row">
                <div className="col-sm-12 mb-1">
                  {profilePics[post.postNumber] ? (
                    profilePics[post.postNumber].length ? (
                      <>
                        <img
                          alt="Your"
                          src={profilePics[post.postNumber]}
                          className="img photo-post"
                        />
                        <span className="h6 text-color-main">
                          {_.startCase(post.name)}
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="img photo-post-placeholder" />
                        <span className="h6 placeholder-image-name text-color-main">
                          {_.startCase(post.name)}
                        </span>
                      </>
                    )
                  ) : (
                    <></>
                  )}
                </div>
                <div className="col-sm-12 mb-1">
                  <span className="h6 text-color-main">
                    {_.startCase(post.title)}
                  </span>
                </div>
                <div className="col-sm-12 text-color-sec">
                  <p>{_.startCase(post.about)}</p>
                </div>

                {post.image.length > 1 ? (
                  <>
                    <Carousel post={post} />
                  </>
                ) : post.image.length === 0 ? (
                  <></>
                ) : (
                  <>
                    {" "}
                    <img
                      className="col-sm-12  post-image"
                      src={post.image}
                      alt=""
                    />
                  </>
                )}

                <div className="col-sm-12">Comments Section</div>
              </div>
            </div>
            <div className="col-md-3"></div>
          </div>
        ) : (
          getPhoto(post)
        );
      })}
    </>
  );
}

export default Post;
