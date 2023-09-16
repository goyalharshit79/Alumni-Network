import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";

export default function Message(props) {
  const [sender, setSender] = useState();

  useEffect(() => {
    const getUser = async () => {
      try {
        const address =
          "http://localhost:8000/get-user?userId=" + props.message.sender;
        const res = await axios.get(address);
        setSender(res.data[0]);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [props]);
  //marking the messages that have been read as read
  useEffect(() => {
    const markRead = async () => {
      try {
        // console.log("gonna call");
        const address = "http://localhost:8000/mark-read/" + props.message._id;
        const res = await axios.get(address);
        res.data && props.markRead(props.currentConversation);
      } catch (error) {
        console.log(error);
      }
    };
    !props.own && markRead();
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
                        props.handleDeleteMessage(props.message);
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
      <div className="message-bottom me-2 ms-5 text-color-main">
        {format(props.message.createdAt)}
      </div>
    </div>
  );
}
