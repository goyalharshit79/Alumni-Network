import React, { useEffect, useState } from "react";
import Home from "./home";
import LandingPage from "./landing-page";
import NavBar from "./navbar";
import Account from "./account";
import { useCookies } from "react-cookie";
import FirstLogin from "./firstLogin";
import Explore from "./explore";
import Chat from "./chat";
import axios from "axios";
import Acc from "./acc";
function App() {
  const [cookies, setCookie, removeCookie] = useCookies([
    "userClicked",
    "email",
    "user",
    "page",
  ]);

  const [isLoggedIn, setIsLoggedin] = useState(() => {
    if (cookies.user) {
      return true;
    } else {
      return false;
    }
  });
  useEffect(() => {
    if (!cookies.page) {
      setCookie("page", "Home");
    }
  });
  const [isFirstLogin, setFirstLogin] = useState(false);
  const [userDetails, setUserDetails] = useState();
  const [userClicked, setUserClicked] = useState();
  const [accountClicked, setAccountClicked] = useState(() => {
    if (cookies.page === "Account") {
      return true;
    } else {
      return false;
    }
  });
  const [homeClicked, setHomeClicked] = useState(() => {
    if (cookies.page === "Home") {
      return true;
    } else if (!cookies.page) {
      return true;
    } else {
      return false;
    }
  });
  const [exploreClicked, setExploreClicked] = useState(() => {
    if (cookies.page === "Explore") {
      return true;
    } else {
      return false;
    }
  });
  const [chatClicked, setChatClicked] = useState(() => {
    if (cookies.page === "Chat") {
      return true;
    } else {
      return false;
    }
  });
  const [usersFound, setUsersFound] = useState();
  const [conversations, setConversations] = useState();
  const [unreadMessages, setUnreadMessages] = useState([]);
  //login and cookie stuff
  useEffect(() => {
    if (isLoggedIn && !cookies.user) {
      putCookies();
    }
  });
  useEffect(() => {
    if (cookies.user && !userDetails) {
      updateDetails();
    }
  });
  function loggedIn(emailRecd) {
    setCookie("email", emailRecd);
    setIsLoggedin(true);
  }
  function firstLogin() {
    setFirstLogin(true);
  }
  function updateDetails() {
    const address = "http://localhost:8000";
    const reqData = {
      email: cookies.email,
      user: cookies.user.user,
    };
    fetch(address + "/give-details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqData),
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        setUserDetails(data.details);
      });
  }
  function putCookies() {
    const address = "http://localhost:8000";
    const reqData = {
      email: cookies.email,
    };
    fetch(address + "/retain-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqData),
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        setCookie("user", data);
      });
  }

  //handling the unread messages displaying stuff
  ////getting the conversations of the logged in user
  useEffect(() => {
    const getConversations = async () => {
      const address =
        "http://localhost:8000/conversation/" + cookies.user?.userId;
      const res = await axios.get(address);
      setConversations(res.data);
    };
    getConversations();
  }, [cookies]);
  ////getting and filtering all the messages of all the conversations to find out unread messages\
  // handleLogout();
  useEffect(() => {
    console.log("-------------------------------------");
    const getAllMessages = async () => {
      conversations?.forEach(async (conv) => {
        const address = "http://localhost:8000/get-messages/" + conv._id;
        const res = await axios.get(address);
        console.log(conv);
        res.data.forEach((m) => {
          let alreadyThere = false;
          unreadMessages.forEach((um) => {
            if (um._id === m._id) {
              alreadyThere = true;
              console.log(m._id);
              console.log("----");
            }
          });
          !alreadyThere &&
            !m.read &&
            m.sender !== cookies.user.userId &&
            setUnreadMessages((prev) => {
              return [...prev, m];
            });
        });
      });
    };
    getAllMessages();
  }, [conversations, cookies]);
  // console.log(unreadMessages);
  ////when the user reads a msg, reducing it from the array of unread messages
  function markConversationRead(conv) {
    let updatedUnreadMessages = [];
    unreadMessages.forEach((um) => {
      if (um.conversationId !== conv._id) {
        updatedUnreadMessages.push(um);
      }
    });
    setUnreadMessages(updatedUnreadMessages);
    let updatedConversations = [];
    conversations.forEach((conversation) => {
      if (conversation._id !== conv._id) {
        updatedConversations.push(conversation);
      }
    });
    setConversations(updatedConversations);
  }

  //changing the tab as per tab clicked in the nav bar
  function goToTab(element, data) {
    if (element === "Account") {
      setHomeClicked(false);
      setAccountClicked(true);
      setExploreClicked(false);
      removeCookie("userClicked");
      setCookie("page", "Account");
    } else if (element === "Home") {
      removeCookie("userClicked");
      setHomeClicked(true);
      setAccountClicked(false);
      setExploreClicked(false);
      setCookie("page", "Home");
    } else if (element === "Explore") {
      if (data) {
        setUsersFound(data);
      } else {
        setUsersFound();
      }
      setCookie("page", "Explore");
      removeCookie("userClicked");
      setUserClicked();
      setHomeClicked(false);
      setAccountClicked(false);
      setExploreClicked(true);
    } else if (element === "Chat") {
      setChatClicked(true);
      setHomeClicked(false);
      setAccountClicked(false);
      setExploreClicked(false);
      removeCookie("userClicked");
      setCookie("page", "Chat");
    }
  }
  //logout function
  function handleLogout() {
    removeCookie("user");
    removeCookie("email");
    removeCookie("page");
    setIsLoggedin(false);
    setUserDetails();
  }
  //closing the firstLogin modal
  function closeFirstLogin() {
    setFirstLogin(false);
  }
  //setting the body's dimensions subtracting the navbar
  // useEffect(() => {
  //   setDimensions();
  // });
  // const setDimensions = () => {
  //   const window = $("html").innerHeight();
  //   // console.log(window);
  //   const nav = $("#navBar").outerHeight();
  //   // console.log(nav);
  //   $("#my-container").outerHeight(window - nav);
  //   // console.log(window - nav);
  // };

  //explore page functions
  function handleUserClicked(email) {
    setCookie("userClicked", email);
  }
  function getClickedUserDetails() {
    const address = "http://localhost:8000";
    const reqData = {
      email: cookies.userClicked,
    };
    fetch(address + "/get-user-details", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqData),
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.msg === "900") {
          setCookie("userClicked", data.user);
          setUserClicked(data.userDetails);
        }
      });
  }
  useEffect(() => {
    if (cookies.userClicked && !userClicked) {
      console.log("putin");
      getClickedUserDetails();
    }
  });
  return isLoggedIn ? (
    isFirstLogin ? (
      <>
        {userDetails ? (
          <FirstLogin
            user={cookies.user}
            closeFirstLogin={closeFirstLogin}
            updateDetails={updateDetails}
            from="firstLogin"
            userDetails={userDetails}
          />
        ) : (
          <></>
        )}

        <NavBar
          unreadMessages={unreadMessages}
          className="nav-bar"
          tabChange={goToTab}
          logout={handleLogout}
        />
        {cookies.user ? <Home user={cookies.user} /> : <></>}
      </>
    ) : homeClicked ? (
      <>
        <NavBar
          unreadMessages={unreadMessages}
          className="nav-bar"
          tabChange={goToTab}
          logout={handleLogout}
        />
        {cookies.user ? <Home user={cookies.user} /> : <></>}
      </>
    ) : accountClicked ? (
      userDetails ? (
        <>
          <NavBar
            unreadMessages={unreadMessages}
            className="nav-bar"
            tabChange={goToTab}
            logout={handleLogout}
          />
          <Account
            cookies={cookies}
            userDetails={userDetails}
            closeFirstLogin={closeFirstLogin}
            updateDetails={updateDetails}
          />
        </>
      ) : (
        <></>
      )
    ) : exploreClicked ? (
      cookies.userClicked ? (
        <>
          <NavBar
            unreadMessages={unreadMessages}
            from="Explore"
            className="nav-bar"
            tabChange={goToTab}
            logout={handleLogout}
          />
          <Acc
            user={cookies.userClicked}
            userClicked={userClicked}
            from="explore"
          />
        </>
      ) : (
        <>
          <NavBar
            unreadMessages={unreadMessages}
            className="nav-bar"
            tabChange={goToTab}
            logout={handleLogout}
          />
          <Explore
            loggedInUser={cookies.email}
            users={usersFound}
            userClicked={handleUserClicked}
          />
        </>
      )
    ) : chatClicked ? (
      <>
        <NavBar
          unreadMessages={unreadMessages}
          className="nav-bar"
          tabChange={goToTab}
          logout={handleLogout}
        />
        <Chat
          markConversationRead={markConversationRead}
          unreadMessages={unreadMessages}
          user={cookies.user}
        />
      </>
    ) : (
      <></>
    )
  ) : (
    <div>
      <LandingPage loggedIn={loggedIn} firstLogin={firstLogin} />
    </div>
  );
}

export default App;
