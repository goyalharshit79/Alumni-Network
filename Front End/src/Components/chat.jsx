import React from "react";
import Conversation from "./conversation";
import Message from "./message";
import { useState, useEffect } from "react";

export default function Chat(props) {
  const [conversations, setConversations] = useState([]);
  // getting the conversations of the logged in user
  useEffect(() => {
    const getConversation = async () => {
      const address = "http://localhost:8000/conversation/" + props.user.userId;
      fetch(address, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        });
    };
    getConversation();
  }, [props.user]);
  return (
    <>
      <div className="chat-page-container ">
        <div className="contacts-container">
          <div className="contacts-wrapper">
            <div className="form-floating">
              <input
                type="text"
                className="form-control chat-search-input"
                id="searchChat"
                name="searchChat"
                placeholder="Search for a char"
              />
              <label htmlFor="addComment" className="mx-2">
                Search for a chat
              </label>
            </div>
            <Conversation />
            <Conversation />
          </div>
        </div>
        <div className="chats-container">
          <div className="chats-wrapper">
            <div className="current-contact">
              <img className="conversation-img" src="debate4.jpg" alt="" />
              <span className=" conversation-text fw-bold text-color-main">
                Harshit Goyal
              </span>
            </div>
            <div className="chat-top">
              <Message />
              <Message own={true} />
              <Message />
              <Message />
              <Message />
              <Message />
            </div>
            <div className="chat-bottom">
              <textarea
                name="chatMessage"
                id="chatMessage"
                className="chat-message-input"
              ></textarea>
              <button className="chat-message-send btn btn-color-2">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
