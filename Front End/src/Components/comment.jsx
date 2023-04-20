import React, { useEffect, useState } from "react";
import _ from "lodash";
import Options from "./options";
import CommentReply from "./commentReply";

export default function Comment(props) {
  const [commentPic, setCommentPic] = useState();
  const [commentorName, setCommentorName] = useState();
  const [showAllComments, setShowAllComments] = useState(false);

  const [comments, setComments] = useState();

  useEffect(() => {
    getComments();
  }, []);
  const getComments = async () => {
    try {
      const address = "http://localhost:8000";
      const reqPayload = {
        postId: props.post._id,
      };
      fetch(address + "/get-comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqPayload),
        mode: "cors",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.msg === "900") {
            setComments(data.comments);
          } else {
            console.log("somthng went wrong bro");
          }
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };
  function handleAddComment(e, post) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const address = "http://localhost:8000";
    const reqPayload = {
      postId: post._id,
      newComment: data.get("addComment"),
      email: props.user.email,
    };
    fetch(address + "/add-comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqPayload),
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.msg === "900") {
          document.getElementById("addComment").value = "";
          getComments();
          getCommentPic(data.comment);
        } else {
          console.log("smthgn went wrong try again");
        }
      })
      .catch((err) => console.log(err));
  }
  function getCommentPic(comment) {
    const address = "http://localhost:8000";
    const reqPayload = {
      email: comment.commentor,
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
          setCommentPic((prev) => {
            return {
              ...prev,
              [comment._id]: data.pic,
            };
          });
          setCommentorName((prev) => {
            return {
              ...prev,
              [comment._id]: data.name,
            };
          });
        }
      })
      .catch((err) => console.log(err));
  }
  function handleShowAllComments() {
    setShowAllComments(true);
  }

  function handleDeleteComment(commentId) {
    const address = "http://localhost:8000";
    const reqPayload = {
      commentId: commentId,
    };
    fetch(address + "/delete-comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqPayload),
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.msg === "900") {
          getComments();
          console.log("deleted successfully");
        } else {
          console.log("There was some error");
        }
      })
      .catch((err) => console.log(err));
  }
  // console.log("logged in : ", props.user.email);
  // console.log("commentor: ", comments);
  return (
    <>
      <form
        onSubmit={(e) => {
          handleAddComment(e, props.post);
        }}
        className="row pe-2 mt-3"
      >
        <div className="form-floating col-sm-10">
          <input
            type="text"
            className="form-control comment-input my-input"
            id="addComment"
            name="addComment"
            placeholder="Add a comment"
          />
          <label htmlFor="addComment">Add a comment</label>
        </div>
        <button
          className="btn btn-color-1  col-sm-2 comment-submit"
          type="submit"
        >
          Submit
        </button>
      </form>

      <div className="comment-section mt-2">
        {comments ? (
          comments.length > 2 ? (
            showAllComments ? (
              <>
                {
                  <>
                    {comments.map((comment) => {
                      return (
                        <div className="row mb-3">
                          {Object.keys(commentPic).length === comments.length &&
                          commentorName ? (
                            <>
                              <div className="col-sm-1 comment-img-container">
                                <img
                                  src={commentPic[comment._id]}
                                  className="comment-img"
                                  alt=""
                                />
                              </div>
                              <span className="col-sm-5 text-color-sec fw-bold">
                                {_.startCase(commentorName[comment._id])}
                              </span>
                              <div className="col-sm-5"></div>
                              {/* the options menu for deleting which will only be visible if the logged in user is the commentor or the teacher*/}
                              <div className="col-sm-1">
                                {props.user.user === "Teacher" ||
                                props.user.email === comment.commentor ? (
                                  <>
                                    <div
                                      className={
                                        "comment-menu-container ms-3" +
                                        comment._id
                                      }
                                      onClick={() => {
                                        props.handleShowOptions(comment._id);
                                      }}
                                    >
                                      <img
                                        src="3 dots.png"
                                        className="comment-menu "
                                        id="options"
                                        alt="menu"
                                        onClick={() => {
                                          props.handleShowOptions(comment._id);
                                        }}
                                      />
                                      {props.showOptions === comment._id ? (
                                        <>
                                          <div className="comment-options ">
                                            <span
                                              className="comment-options-item"
                                              onClick={() => {
                                                handleDeleteComment(
                                                  comment._id
                                                );
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
                            </>
                          ) : (
                            getCommentPic(comment)
                          )}
                          <div className="col-sm-1"></div>
                          <div className="comment-text text-color-sec col-sm-11">
                            {comment.comment}
                          </div>

                          {/* reply stuff starts here*/}
                          <CommentReply
                            user={props.user}
                            showOptions={props.showOptions}
                            handleShowOptions={props.handleShowOptions}
                            comment={comment}
                          />
                        </div>
                      );
                    })}
                    <a
                      className="text-color-main show-all-comments fw-bold"
                      href="/#"
                      onClick={() => setShowAllComments(false)}
                    >
                      Hide
                    </a>
                  </>
                }
              </>
            ) : (
              <>
                {comments.slice(0, 2).map((comment) => {
                  return (
                    <div className="row mb-3">
                      {commentPic && commentorName ? (
                        <>
                          <div className="col-sm-1 comment-img-container">
                            <img
                              src={commentPic[comment._id]}
                              className="comment-img"
                              alt=""
                            />
                          </div>
                          <span className="col-sm-5 text-color-sec fw-bold">
                            {_.startCase(commentorName[comment._id])}
                          </span>
                          <div className="col-sm-5"></div>
                          {/* the options menu for deleting which will only be visible if the logged in user is the commentor or the teacher*/}
                          <div className="col-sm-1">
                            {props.user.user === "Teacher" ||
                            props.user.email === comment.commentor ? (
                              <>
                                <div
                                  className={
                                    "comment-menu-container ms-3" + comment._id
                                  }
                                  onClick={() => {
                                    props.handleShowOptions(comment._id);
                                  }}
                                >
                                  <img
                                    src="3 dots.png"
                                    className="comment-menu "
                                    id="options"
                                    alt="menu"
                                    onClick={() => {
                                      props.handleShowOptions(comment._id);
                                    }}
                                  />
                                  {props.showOptions === comment._id ? (
                                    <>
                                      <div className="comment-options ">
                                        <span
                                          className="comment-options-item"
                                          onClick={() => {
                                            handleDeleteComment(comment._id);
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
                        </>
                      ) : (
                        getCommentPic(comment)
                      )}
                      <div className="col-sm-1"></div>
                      <div className="comment-text text-color-sec col-sm-11">
                        {comment.comment}
                      </div>
                      {/* reply stuff starts here*/}
                      <CommentReply
                        user={props.user}
                        showOptions={props.showOptions}
                        handleShowOptions={props.handleShowOptions}
                        comment={comment}
                      />
                    </div>
                  );
                })}
                <a
                  className="text-color-main show-all-comments fw-bold"
                  href="/#"
                  onClick={handleShowAllComments}
                >
                  Show All
                </a>
              </>
            )
          ) : (
            <>
              {comments.map((comment) => {
                return (
                  <div className="row mb-3">
                    {commentPic && commentorName ? (
                      <>
                        <div className="col-sm-1">
                          <img
                            src={
                              commentPic[comment._id]
                                ? commentPic[comment._id].length
                                  ? commentPic[comment._id]
                                  : "defaultPic.jpg"
                                : null
                            }
                            className="comment-img"
                            alt=""
                          />
                        </div>
                        <span className="col-sm-4 ms-2 text-color-sec fw-bold">
                          {_.startCase(commentorName[comment._id])}
                        </span>
                        <div className="col-sm-5"></div>

                        {/* the options menu for deleting which will only be visible if the logged in user is the commentor or the teacher*/}
                        <div className="col-sm-1">
                          {props.user.user === "Teacher" ||
                          props.user.email === comment.commentor ? (
                            <>
                              <div
                                className={
                                  "comment-menu-container ms-3" + comment._id
                                }
                                onClick={() => {
                                  props.handleShowOptions(comment._id);
                                }}
                              >
                                <img
                                  src="3 dots.png"
                                  className="comment-menu "
                                  id="options"
                                  alt="menu"
                                  onClick={() => {
                                    props.handleShowOptions(comment._id);
                                  }}
                                />
                                {props.showOptions === comment._id ? (
                                  <>
                                    <div className="comment-options ">
                                      <span
                                        className="comment-options-item"
                                        onClick={() => {
                                          handleDeleteComment(comment._id);
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
                      </>
                    ) : (
                      getCommentPic(comment)
                    )}
                    <div className="col-sm-1"></div>
                    <div className="comment-text text-color-sec col-sm-11">
                      {comment.comment}
                    </div>

                    {/* reply stuff starts here*/}
                    <CommentReply
                      user={props.user}
                      showOptions={props.showOptions}
                      handleShowOptions={props.handleShowOptions}
                      comment={comment}
                    />
                  </div>
                );
              })}
            </>
          )
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
