import React from "react";

export default function Message(props) {
  return (
    <div className={props.own ? "message own" : "message"}>
      <div className="message-top">
        <img className="message-img" src="debate4.jpg" alt="" />
        <span className="message-text text-color-sec">
          This is a messageThis is a messageThis is a messageThis is a
          messageThis is a messageThis is a message
        </span>
      </div>
      <div className="message-bottom text-color-main">1 hour ago</div>
    </div>
  );
}
