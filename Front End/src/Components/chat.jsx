import React, { useRef } from "react";
import Conversation from "./conversation";
import Message from "./message";
import { useState, useEffect } from "react";
import _ from "lodash";
import axios from "axios";

export default function Chat(props) {
  const scrollRef = useRef();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentChatter, setCurrentChatter] = useState();
  const [showOptions, setShowOptions] = useState("");
  const [areMessagesRead, setAreMessagesRead] = useState();
  // const [currentChattersDetails, setCurrentChattersDetails] = useState({});

  // useEffect(() => {
  //   const getUserData = async () => {
  //     currentConversation?.members.forEach(async (member) => {
  //       const address = "http://localhost:8000/get-user?userId=" + member;
  //       const res = await axios.get(address);
  //       setCurrentChattersDetails((prev) => {
  //         return {
  //           ...prev,
  //           [member]: res.data[0],
  //         };
  //       });
  //     });
  //   };
  //   getUserData();
  // }, [currentConversation]);
  // console.log(currentChattersDetails);
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
          setConversations(data);
        });
    };
    getConversation();
  }, [props.user]);
  //getting messages of the clicked conversation
  useEffect(() => {
    const getMessages = async () => {
      if (currentConversation) {
        const address =
          "http://localhost:8000/get-messages/" + currentConversation._id;

        fetch(address, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
        })
          .then((response) => response.json())
          .then((data) => {
            setMessages(data);
          });
      }
    };
    getMessages();
  }, [currentConversation]);
  //getting user details for showing on top of the chat box
  useEffect(() => {
    const getUser = async () => {
      if (currentConversation) {
        try {
          const friendId = currentConversation.members.filter(
            (m) => m !== props.user.userId
          );
          const address = "http://localhost:8000/get-user?userId=" + friendId;
          fetch(address, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            mode: "cors",
          })
            .then((response) => response.json())
            .then((data) => {
              setCurrentChatter(data[0]);
            });
        } catch (error) {
          console.log(error);
        }
      }
    };
    getUser();
  }, [currentConversation, props.user]);
  //scrolling to the end of the messages
  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  // function to send the messaged
  function handleSendMessage(e) {
    const address = "http://localhost:8000";
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const reqData = {
      text: data.get("chatMessage"),
      conversationId: currentConversation._id,
      sender: props.user.userId,
    };
    fetch(address + "/new-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqData),
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        setMessages([...messages, data]);
        document.getElementById("chatMessage").value = "";
      })
      .catch((err) => console.log(err));
  }
  // handling showing the options
  function handleShowOptions(id) {
    setShowOptions(id);
  }
  //deleting message
  function handleDeleteMessage(messageId) {
    const address =
      "http://localhost:8000/delete-message?messageId=" + messageId;
    fetch(address, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        setMessages(() => {
          const tempMessageHolder = messages.filter((m) => {
            return m._id !== messageId;
          });
          return tempMessageHolder;
        });
      })
      .catch((err) => console.log(err));
  }
  function markRead(conv) {
    setAreMessagesRead({ [conv._id]: true });
    props.markConversationRead(conv);
  }
  // console.log(areMessagesRead);
  return (
    <>
      <div
        className="chat-page-container"
        onClick={(e) => {
          if (e.target.id !== "options") {
            setShowOptions();
          }
        }}
      >
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
            {conversations?.map((conversation) => {
              return (
                <div
                  onClick={() => {
                    setCurrentConversation(conversation);
                  }}
                >
                  <Conversation
                    unreadMessages={
                      areMessagesRead
                        ? areMessagesRead[conversation._id]
                          ? []
                          : props.unreadMessages
                        : props.unreadMessages
                    }
                    conversation={conversation}
                    currentUser={props.user}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="chats-container">
          <div className="chats-wrapper">
            {currentConversation ? (
              <>
                <div className="current-contact">
                  <img
                    className="conversation-img me-3"
                    src={
                      currentChatter?.pic.length
                        ? currentChatter.pic
                        : "defaultPic.jpg"
                    }
                    alt=""
                  />
                  <span className=" conversation-text fw-bold text-color-main">
                    {_.startCase(
                      currentChatter?.fName + " " + currentChatter?.lName
                    )}
                  </span>
                </div>
                <div className="chat-top">
                  {messages.map((m) => {
                    return (
                      <div ref={scrollRef}>
                        <Message
                          markRead={markRead}
                          currentConversation={currentConversation}
                          handleDeleteMessage={handleDeleteMessage}
                          message={m}
                          handleShowOptions={handleShowOptions}
                          showOptions={showOptions}
                          own={m.sender === props?.user.userId ? true : false}
                        />
                      </div>
                    );
                  })}
                </div>
                <form className="chat-bottom" onSubmit={handleSendMessage}>
                  <textarea
                    name="chatMessage"
                    id="chatMessage"
                    className="chat-message-input"
                  ></textarea>
                  <button className="chat-message-send btn btn-color-2">
                    Send
                  </button>
                </form>
              </>
            ) : (
              <>
                <span className="before-conversation text-color-sec">
                  Open a conversation to see messages.
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
