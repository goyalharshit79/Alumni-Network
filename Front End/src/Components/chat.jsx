import React, { useRef } from "react";
import Conversation from "./conversation";
import Message from "./message";
import { useState, useEffect } from "react";
import _ from "lodash";
import { io } from "socket.io-client";
import axios from "axios";
import Typing from "./typing";

export default function Chat(props) {
  const scrollRef = useRef();
  const scrollRefTyping = useRef();
  const socket = useRef();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentChatter, setCurrentChatter] = useState();
  const [showOptions, setShowOptions] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [showTyping, setShowTyping] = useState(null);
  //socket stuff
  ////setting the socket connection
  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage(data);
    });
    socket.current.on("showTyping", (data) => {
      setShowTyping(data);
    });
  }, []);
  // useEffect(() => {
  //   if (showTyping) {
  //     if (
  //       showTyping?.conversation?._id === currentConversation?._id &&
  //       showTyping?.userId !== props.user.userId
  //     ) {
  //       const d = {
  //         _id: messages[0]._id,
  //         conversationId: showTyping?.conversation?._id,
  //         sender: showTyping?.userId,
  //         text: "Typing...",
  //         read: true,
  //       };
  //       let alreadyThere = false;
  //       messages.forEach((m) => {
  //         if (m.text === "trying") {
  //           console.log("first");
  //           alreadyThere = true;
  //         }
  //       });
  //       if (!alreadyThere) {
  //         console.log("setting");
  //         setMessages((prev) => [...prev, d]);
  //       }
  //     }
  //   }
  // }, [showTyping, currentConversation]);
  // console.log(messages);
  useEffect(() => {
    // currentConversation?.members.includes(props.user.userId) &&
    // currentConversation?.members.includes(arrivalMessage.sender) &&
    arrivalMessage &&
      currentConversation._id === arrivalMessage.conversationId &&
      setMessages((prev) => [...prev, arrivalMessage.message]);
  }, [arrivalMessage, currentConversation]);
  //handling the deletion of a message
  useEffect(() => {
    socket.current.on("updateDeleteMessage", (message) => {
      setMessages((prev) => {
        return prev.filter((m) => m._id !== message._id);
      });
    });
  }, []);
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
    scrollRefTyping?.current?.scrollIntoView({ behavior: "smooth" });
  });
  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  // function to send the messaged
  async function handleSendMessage(e) {
    const address = "http://localhost:8000";
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const reqData = {
      text: data.get("chatMessage"),
      conversationId: currentConversation._id,
      sender: props.user.userId,
    };

    try {
      const res = await axios.post(address + "/new-message", reqData);
      socket.current.emit("sendMessage", {
        receiverId: currentChatter._id,
        message: res.data,
        conversationId: currentConversation._id,
      });
      socket.current.emit("typing", {
        text: "",
        conversation: currentConversation._id,
        userId: props.user.userId,
      });
      document.getElementById("chatMessage").value = "";
    } catch (error) {
      console.log(error);
    }
  }
  // handling showing the options
  function handleShowOptions(id) {
    setShowOptions(id);
  }
  //deleting message
  function handleDeleteMessage(message) {
    const address =
      "http://localhost:8000/delete-message?messageId=" + message._id;
    const res = axios.get(address);
    socket.current.emit("deleteMessage", message);
  }
  function markRead(conv) {
    props.markConversationRead(conv);
  }
  function handleShowTyping(e) {
    socket.current.emit("typing", {
      text: e.target.value,
      conversation: currentConversation._id,
      userId: props.user.userId,
    });
  }
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
                    onlineUsers={props.onlineUsers}
                    unreadMessages={props.unreadMessages}
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
                  <span className="conversation-text fw-bold text-color-main">
                    {_.startCase(
                      currentChatter?.fName + " " + currentChatter?.lName
                    )}
                  </span>
                </div>
                <div className="chat-top">
                  {messages.map((m) => {
                    return (
                      m && (
                        <>
                          <div ref={scrollRef}>
                            <Message
                              markRead={markRead}
                              currentConversation={currentConversation}
                              handleDeleteMessage={handleDeleteMessage}
                              message={m}
                              handleShowOptions={handleShowOptions}
                              showOptions={showOptions}
                              own={
                                m?.sender === props?.user.userId ? true : false
                              }
                            />
                          </div>
                        </>
                      )
                    );
                  })}
                  {showTyping &&
                    showTyping.conversation === currentConversation._id &&
                    showTyping.userId !== props.user.userId &&
                    showTyping.text !== "" && (
                      <>
                        <div ref={scrollRefTyping}>
                          <Typing sender={showTyping.userId} />
                        </div>
                      </>
                    )}
                </div>
                <form className="chat-bottom" onSubmit={handleSendMessage}>
                  <textarea
                    name="chatMessage"
                    id="chatMessage"
                    className="chat-message-input"
                    onChange={handleShowTyping}
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
