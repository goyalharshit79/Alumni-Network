import React from "react";
import Conversation from "./conversation";

export default function Chat() {
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
            <div className="chat-top"></div>
            <div className="chat-bottom"></div>
          </div>
        </div>
      </div>
    </>
  );
}
