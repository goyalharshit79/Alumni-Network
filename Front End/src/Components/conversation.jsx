import React from "react";
import { useEffect, useState } from "react";
import _ from "lodash";

export default function Conversation(props) {
  const [friend, setFriend] = useState();
  useEffect(() => {
    const friendId = props.conversation.members.filter(
      (m) => m !== props.currentUser.userId
    );
    const getUser = async () => {
      try {
        const address = "http://localhost:8000/get-user?userId=" + friendId;
        fetch(address, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
        })
          .then((response) => response.json())
          .then((data) => {
            setFriend(data[0]);
          });
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [props]);
  return (
    <>
      <div className="conversation">
        <div className="conversation-img-container">
          <img
            className="conversation-img"
            src={friend?.pic.length ? friend.pic : "defaultPic.jpg"}
            alt=""
          />
          <div className="online-badge"></div>
        </div>
        <span className="conversation-text fw-bold text-color-main">
          {_.startCase(friend?.fName + " " + friend?.lName)}
        </span>
      </div>
    </>
  );
}
