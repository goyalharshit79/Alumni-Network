import React, { useEffect, useState } from "react";

export default function Message(props) {
  const [sender, setSender] = useState();

  useEffect(() => {
    const getUser = async () => {
      try {
        const address =
          "http://localhost:8000/get-user?userId=" + props.message.sender;
        fetch(address, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
        })
          .then((response) => response.json())
          .then((data) => {
            setSender(data[0]);
          });
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [props]);

  return (
    <div className={props.own ? "message own" : "message"}>
      <div className="message-top">
        {/* options to delete the message */}
        {props.own ? (
          <>
            <div>
              <img
                src="3 dots.png"
                className="message-menu "
                id="options"
                alt="menu"
                onClick={() => {
                  props.handleShowOptions(props.message._id);
                }}
              />
              {props.showOptions === props.message._id ? (
                <>
                  <div className="message-options ">
                    <span
                      className="comment-options-item"
                      onClick={() => {
                        props.handleDeleteMessage(props.message._id);
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
        {/* the message */}
        <img
          className="message-img"
          src={sender?.pic.length ? sender.pic : "defaultPic.jpg"}
          alt=""
        />
        <span className="message-text text-color-sec">
          {props.message.text}
        </span>
      </div>
      <div className="message-bottom text-color-main">{"1 hour ago"}</div>
    </div>
  );
}
