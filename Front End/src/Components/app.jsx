import React, { useEffect, useState } from "react";
import Home from "./home";
import LandingPage from "./landing-page";
import NavBar from "./navbar";
import Account from "./account";
import { useCookies } from "react-cookie";
import FirstLogin from "./firstLogin";
import Explore from "./explore";

function App() {
  const [cookies, setCookie, removeCookie] = useCookies([
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
      setExploreClicked(true);
      setCookie("page", "Account");
    } else if (element === "Home") {
      setHomeClicked(true);
      setAccountClicked(false);
      setCookie("page", "Home");
    } else if (element === "Explore") {
      if (data) {
        setUsersFound(data);
      } else {
        setUsersFound();
      }
      setCookie("page", "Explore");
      setHomeClicked(false);
      setAccountClicked(false);
      setExploreClicked(true);
    }
  }
  //logout function
  function handleLogout() {
    removeCookie("user");
    removeCookie("email");
    setIsLoggedin(false);
  }
  //closing the firstLogin modal
  function closeFirstLogin() {
    setFirstLogin(false);
  }
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
      <>
        <NavBar
          from="Explore"
          className="nav-bar"
          tabChange={goToTab}
          logout={handleLogout}
        />
        <Explore users={usersFound} />
      </>
    ) : (
      <>
        <NavBar className="nav-bar" tabChange={goToTab} logout={handleLogout} />
        kuch gadbag hai
      </>
    )
  ) : (
    <div>
      <LandingPage loggedIn={loggedIn} firstLogin={firstLogin} />
    </div>
  );
}

export default App;
