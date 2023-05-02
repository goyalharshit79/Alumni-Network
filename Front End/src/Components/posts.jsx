import React, { useEffect, useRef, useState } from "react";
import _ from "lodash";
import Carousel from "./carousel";
import Comment from "./comment";
import axios from "axios";
import { io } from "socket.io-client";

function Post(props) {
  const [profilePics, setProfilePics] = useState();
  const [showComment, setShowComment] = useState([]);
  const [likes, setLikes] = useState();
  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
  }, []);
  useEffect(() => {
    socket.current.on("getLikes", (data) => {
      setLikes((prev) => {
        return {
          ...prev,
          [data.postId]: data.likes,
        };
      });
    });
  }, [likes]);
  useEffect(() => {
    props.posts.forEach((post) => {
      setLikes((prev) => {
        return {
          ...prev,
          [post._id]: post.likes,
        };
      });
    });
  }, [props]);
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
  async function handleLike(postId) {
    try {
      const address = "http://localhost:8000/toggle-like";
      const reqData = {
        postId: postId,
        userId: props.user.userId,
      };
      const res = await axios.post(address, reqData);
      socket.current.emit("updateLikes", {
        likes: res.data.likes,
        postId: res.data._id,
      });
    } catch (error) {
      console.log(error);
    }
  }
  function handleShowCommentSection(postId) {
    var alreadyOpen = false;
    if (postId) {
      showComment.forEach((element) => {
        if (element === postId) {
          alreadyOpen = true;
        }
      });
    }
    if (alreadyOpen) {
      setShowComment((prev) => {
        prev = prev.filter((id) => {
          return id !== postId;
        });
        return prev;
      });
    } else {
      setShowComment((prev) => {
        if (prev) {
          return [...prev, postId];
        } else {
          return postId;
        }
      });
    }
  }
  function handleDeletePost(postId) {
    const address = "http://localhost:8000";
    const reqPayload = {
      postId: postId,
    };
    fetch(address + "/delete-post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqPayload),
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.msg === "900") {
          props.getPosts();
        }
      })
      .catch((err) => console.log(err));
  }
  return (
    <>
      {props.posts.map((post) => {
        return profilePics ? (
          <div className="row mb-5">
            <div className="col-md-3"></div>

            <div className="card p-3 post bg-color col-md-6">
              <div className="row">
                <div className="col-sm-11 mb-1">
                  {profilePics[post.postNumber] ? (
                    <>
                      <img
                        alt="Your"
                        src={
                          profilePics[post.postNumber].length
                            ? profilePics[post.postNumber]
                            : "defaultPic.jpg"
                        }
                        className="img photo-post"
                      />
                    </>
                  ) : (
                    <></>
                  )}
                  <span className="h6 text-color-main">
                    {_.startCase(post.name)}
                  </span>
                </div>

                {/* option for the post */}

                <div className="col-sm-1 mt-2">
                  {props.user.user === "Teacher" ||
                  props.user.email === post.email ? (
                    <>
                      <div
                        className={"comment-menu-container ms-3" + post._id}
                        onClick={() => {
                          props.handleShowOptions(post._id);
                        }}
                      >
                        <img
                          src="3 dots.png"
                          className="comment-menu "
                          id="options"
                          alt="menu"
                          onClick={() => {
                            props.handleShowOptions(post._id);
                          }}
                        />
                        {props.showOptions === post._id ? (
                          <>
                            <div className="comment-options ">
                              <span
                                className="comment-options-item"
                                onClick={() => {
                                  handleDeletePost(post._id);
                                }}
                              >
                                Delete
                              </span>
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </>
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

                {/* the media added intot the post */}
                {post.image.length > 1 ? (
                  <>
                    <Carousel post={post} />
                  </>
                ) : post.image.length === 0 ? (
                  <></>
                ) : (
                  <>
                    <img
                      className="col-sm-12  post-image"
                      src={post.image}
                      alt=""
                    />
                  </>
                )}

                {/* liking the posts */}
                <div className="col-sm-12 mt-2">
                  <div className="row mx-auto">
                    {}
                    <img
                      src={
                        likes[post._id].includes(props.user.userId)
                          ? "likesThumbUp.svg"
                          : "thumbUp.svg"
                      }
                      className="like-btn col-sm-3"
                      onClick={() => {
                        handleLike(post._id);
                      }}
                      alt=""
                    />
                    <img
                      src="comment.svg"
                      className="comment-btn col-sm-3"
                      onClick={() => {
                        handleShowCommentSection(post._id);
                      }}
                      alt=""
                    />
                  </div>
                </div>
                <div className="like-count">
                  {likes[post._id].length ? (
                    <>{likes[post._id].length} Likes</>
                  ) : (
                    <></>
                  )}
                </div>

                {/* comment stuff */}
                {showComment ? (
                  showComment.map((id) => {
                    return (
                      <>
                        {id === post._id ? (
                          <div
                            className="add-comment-section col-sm-12"
                            id={post._id}
                          >
                            <Comment
                              showOptions={props.showOptions}
                              handleShowOptions={props.handleShowOptions}
                              getPosts={props.getPosts}
                              user={props.user}
                              post={post}
                            />
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
                    );
                  })
                ) : (
                  <></>
                )}
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
