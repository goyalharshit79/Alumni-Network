import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Typing(props) {
  const [sender, setSender] = useState();
  useEffect(() => {
    const getUser = async () => {
      try {
        const address = "http://localhost:8000/get-user?userId=" + props.sender;
        const res = await axios.get(address);
        setSender(res.data[0]);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [props]);
  return (
    <div className="message">
      <div className="message-top">
        <img
          className="message-img"
          src={sender?.pic.length ? sender.pic : "defaultPic.jpg"}
          alt=""
        />
        <span className="message-text text-color-sec">Typing...</span>
      </div>
    </div>
  );
}
