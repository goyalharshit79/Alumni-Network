import React, { useEffect, useState } from "react";
import Home from "./home";
import LandingPage from "./landing-page";
import NavBar from "./navbar";
import Account from "./account";
import { useCookies } from "react-cookie";
import FirstLogin from "./firstLogin";
import Explore from "./explore";
import Chat from "./chat";

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
        if (data.msg === "900") {
          setCookie("user", data.user);
        }
      });
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
  console.log(cookies.page);
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
    console.log("putin mail");
    setCookie("userClicked", email);
  }
  function getClickedUserDetails() {
    const address = "http://localhost:8000";
    const reqData = {
      email: cookies.userClicked,
    };
    fetch(address + "/get-user", {
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

        <NavBar className="nav-bar" tabChange={goToTab} logout={handleLogout} />
        {cookies.user ? <Home user={cookies.user} /> : <></>}
      </>
    ) : homeClicked ? (
      <>
        <NavBar className="nav-bar" tabChange={goToTab} logout={handleLogout} />
        {cookies.user ? <Home user={cookies.user} /> : <></>}
      </>
    ) : accountClicked ? (
      userDetails ? (
        <>
          <NavBar
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
        <NavBar className="nav-bar" tabChange={goToTab} logout={handleLogout} />
        <Chat />
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
