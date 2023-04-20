import React, { useState } from "react";
import _ from "lodash";

export default function CommentReply(props) {
  const [replyDetails, setReplyDetails] = useState({});
  const [showReply, setShowReply] = useState();
  const [wantsToReply, setWantsToReply] = useState();
  const [replies, setReplies] = useState();
  function handleShowReply(id) {
    setShowReply(id);
  }
  function handleWantsToReply(id) {
    setWantsToReply(id);
  }
  function handleAddReply(e, commentId) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const address = "http://localhost:8000";
    const reqPayload = {
      commentId: commentId,
      reply: data.get("addReply"),
      email: props.user.email,
    };
    fetch(address + "/add-reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqPayload),
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.msg === "900") {
          getReply(props.comment._id);
          setWantsToReply();
          document.getElementById("addReply").value = "";
        } else {
        }
      })
      .catch((err) => console.log(err));
  }
  function getReply(commentId) {
    const address = "http://localhost:8000";
    const reqPayload = {
      commentId: commentId,
    };
    fetch(address + "/get-reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqPayload),
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.msg === "900") {
          setReplies(data.replies);
        } else {
        }
      })
      .catch((err) => console.log(err));
  }
  function getReplyDetails(reply) {
    const address = "http://localhost:8000";
    const reqPayload = {
      commentor: reply.commentor,
    };
    fetch(address + "/get-reply-details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqPayload),
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.msg === "900") {
          setReplyDetails({
            ...replyDetails,
            [reply._id]: data.details,
          });
        } else {
        }
      })
      .catch((err) => console.log(err));
  }
  function handleDeleteReply(replyId) {
    const address = "http://localhost:8000";
    const reqPayload = {
      commentId: replyId,
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
          getReply(props.comment._id);
        } else {
          console.log("There was some error");
        }
      })
      .catch((err) => console.log(err));
  }
  console.log(replyDetails);
  return (
    <>
      {wantsToReply === props.comment._id ? (
        <>
          <form
            className="row p-0 mt-2"
            onSubmit={(e) => {
              handleAddReply(e, props.comment._id);
            }}
          >
            <div className="col-sm-1"></div>
            <div className="form-floating col-sm-9">
              <input
                type="text"
                id="addReply"
                name="addReply"
                className="form-control reply-input my-input"
                placeholder="Add a Reply"
              />
              <label htmlFor="addReply">Add a Reply</label>
            </div>
            <button
              type="submit"
              className="btn col-sm-2 btn-color-1 comment-submit"
            >
              Submit
            </button>
          </form>
        </>
      ) : (
        <>
          <div className="col-sm-1"></div>
          <a
            className="text-color-main col-sm-2 show-replies fw-bold"
            href="/#"
            onClick={() => {
              handleWantsToReply(props.comment._id);
            }}
          >
            Reply
          </a>
        </>
      )}
      {showReply === props.comment._id ? (
        replies ? (
          <>
            {wantsToReply ? (
              <>
                <div className="col-sm-1"></div>
                <a
                  className="text-color-main p-0 show-replies col-sm-11 fw-bold "
                  href="/#"
                  onClick={() => {
                    setShowReply();
                  }}
                >
                  Hide Replies
                </a>
              </>
            ) : (
              <>
                <a
                  className="text-color-main col-sm-9 p-0 show-replies fw-bold "
                  href="/#"
                  onClick={() => {
                    setShowReply();
                  }}
                >
                  Hide Replies
                </a>
              </>
            )}
            {replies.length ? (
              <>
                {replies.map((reply) => {
                  return (
                    <>
                      {replyDetails[reply._id] ? (
                        <>
                          <div className="col-sm-1"></div>
                          <div className="col-sm-1 mt-2">
                            <img
                              src={
                                replyDetails[reply._id].pic
                                  ? replyDetails[reply._id].pic
                                  : "defaultPic.jpg"
                              }
                              className="reply-img"
                              alt=""
                            />
                          </div>

                          <span className="col-sm-4 mt-2 text-color-sec fw-bold">
                            {_.startCase(replyDetails[reply._id].name)}
                          </span>
                          <div className="col-sm-4"></div>
                          <div className="col-sm-1">
                            {props.user.user === "Teacher" ||
                            props.comment.commentor === props.user.email ||
                            props.user.email ===
                              replyDetails[reply._id].email ? (
                              <>
                                <div
                                  className=" mt-2 ms-4"
                                  onClick={() => {
                                    props.handleShowOptions(reply._id);
                                  }}
                                >
                                  <img
                                    src="3 dots.png"
                                    className="reply-menu "
                                    id="options"
                                    alt="menu"
                                    onClick={() => {
                                      props.handleShowOptions(reply._id);
                                    }}
                                  />
                                  {props.showOptions === reply._id ? (
                                    <>
                                      <div className="comment-options ">
                                        <span
                                          className="comment-options-item"
                                          onClick={() => {
                                            handleDeleteReply(reply._id);
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
                          {/* options stuff to delete reply */}

                          {/* displaying the reply */}

                          <div className="col-sm-1"></div>
                          <div className="col-sm-1"></div>

                          <span className="col-sm-11 text-color-sec">
                            {_.startCase(reply.comment)}
                          </span>
                        </>
                      ) : (
                        getReplyDetails(reply)
                      )}
                    </>
                  );
                })}
              </>
            ) : (
              <>
                <div className="col-sm-1"></div>

                <span className="col-sm-10 first-to-reply text-color-sec">
                  Be the first to reply...
                </span>
              </>
            )}
          </>
        ) : (
          getReply(props.comment._id)
        )
      ) : (
        <>
          {wantsToReply ? (
            <>
              <div className="col-sm-1"></div>
            </>
          ) : (
            <></>
          )}
          <a
            className="text-color-main col-sm-3 p-0 show-replies fw-bold"
            href="/#"
            onClick={() => {
              handleShowReply(props.comment._id);
            }}
          >
            Show Replies
          </a>
          <div className="col-sm-6"></div>
        </>
      )}
    </>
  );
}
