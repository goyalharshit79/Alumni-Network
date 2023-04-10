import React, { useEffect, useState } from "react";
import Home from "./home";
import LandingPage from "./landing-page";
import NavBar from "./navbar";
import Account from "./account";
import { useCookies } from "react-cookie";
import FirstLogin from "./firstLogin";

function App() {
  const [cookies, setCookie, removeCookie] = useCookies(["email", "user"]);
  const [isLoggedIn, setIsLoggedin] = useState(() => {
    if (cookies.user) {
      return true;
    } else {
      return false;
    }
  });
  const [isFirstLogin, setFirstLogin] = useState(false);
  const [userDetails, setUserDetails] = useState();
  const [accountClicked, setAccountClicked] = useState(false);
  const [homeClicked, setHomeClicked] = useState(true);
  //login and cookie stuff
  useEffect(() => {
    if (isLoggedIn && !cookies.user) {
      putCookies();
    }
  });
  useEffect(() => {
    if (!userDetails && cookies.user) {
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
  function goToTab(element) {
    if (element.innerHTML === "Account") {
      setHomeClicked(false);
      setAccountClicked(true);
    } else if (element.innerHTML === "Home") {
      setHomeClicked(true);
      setAccountClicked(false);
    }
  }
  //logout function
  function handleLogout() {
    removeCookie("user");
    removeCookie("email");
    setIsLoggedin(false);
  }
  //closing the first login modal
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
      <>
        <NavBar className="nav-bar" tabChange={goToTab} logout={handleLogout} />
        <Account
          cookies={cookies}
          userDetails={userDetails}
          closeFirstLogin={closeFirstLogin}
          updateDetails={updateDetails}
        />
      </>
    ) : (
      <>
        <NavBar className="nav-bar" tabChange={goToTab} logout={handleLogout} />
        Kuch gadbad hai
      </>
    )
  ) : (
    <div>
      <LandingPage loggedIn={loggedIn} firstLogin={firstLogin} />
    </div>
  );
}

export default App;
