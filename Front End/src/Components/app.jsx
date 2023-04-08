import React, { useEffect, useState } from "react";
import Home from "./home";
import LandingPage from "./landing-page";
import ThemeSwitch from "./theme-switch";
import NavBar from "./navbar";
import Account from "./account";
import { useCookies } from "react-cookie";
import FirstLogin from "./firstLogin";

function App() {
  const [cookies, setCookie, removeCookie] = useCookies([
    "email",
    "user",
    "theme",
  ]);
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

  // taking care of theme stuff
  const [theme, setTheme] = useState(() => {
    if (cookies.theme) {
      return cookies.theme;
    } else {
      return "light";
    }
  });

  const [color, setColor] = useState(() => {
    if (theme === "light") {
      return "black";
    } else if (theme === "dark") {
      return "white";
    }
  });
  const [btnTheme, setBtnTheme] = useState(() => {
    if (theme === "light") {
      return "dark";
    } else if (theme === "dark") {
      return "light";
    }
  });
  const [oppTheme, setOppTheme] = useState(() => {
    if (theme === "light") {
      return "light";
    } else if (theme === "dark") {
      return "dark";
    }
  });
  function themeSetter(themeRecd, colorRecd, btnThemerecd, oppThemeRecd) {
    setTheme(themeRecd);
    setColor(colorRecd);
    setBtnTheme(btnThemerecd);
    setOppTheme(oppThemeRecd);
  }
  useEffect(() => {
    setCookie("theme", theme);
  }, [setCookie, theme]);
  // theme stuff ends
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
            theme={theme}
            color={color}
            btnTheme={btnTheme}
            closeFirstLogin={closeFirstLogin}
            updateDetails={updateDetails}
            from="firstLogin"
            userDetails={userDetails}
          />
        ) : (
          <></>
        )}

        <NavBar
          className="nav-bar"
          theme={theme}
          color={color}
          btnTheme={btnTheme}
          tabChange={goToTab}
          logout={handleLogout}
        />
        {cookies.user ? (
          <Home
            theme={theme}
            color={color}
            btnTheme={btnTheme}
            user={cookies.user}
          />
        ) : (
          <></>
        )}
      </>
    ) : homeClicked ? (
      <>
        <NavBar
          className="nav-bar"
          theme={theme}
          color={color}
          btnTheme={btnTheme}
          tabChange={goToTab}
          logout={handleLogout}
        />
        {cookies.user ? (
          <Home
            theme={theme}
            color={color}
            btnTheme={btnTheme}
            user={cookies.user}
          />
        ) : (
          <></>
        )}
        <ThemeSwitch theme={theme} themeSetter={themeSetter} />
      </>
    ) : accountClicked ? (
      <>
        <NavBar
          className="nav-bar"
          theme={theme}
          color={color}
          btnTheme={btnTheme}
          tabChange={goToTab}
          logout={handleLogout}
        />
        <Account
          theme={theme}
          oppTheme={oppTheme}
          color={color}
          btnTheme={btnTheme}
          cookies={cookies}
          userDetails={userDetails}
          closeFirstLogin={closeFirstLogin}
          updateDetails={updateDetails}
        />
        <ThemeSwitch theme={theme} themeSetter={themeSetter} />
      </>
    ) : (
      <>
        <NavBar
          className="nav-bar"
          theme={theme}
          color={color}
          btnTheme={btnTheme}
          tabChange={goToTab}
          logout={handleLogout}
        />
        Kuch gadbad hai
        <ThemeSwitch theme={theme} themeSetter={themeSetter} />
      </>
    )
  ) : (
    <div>
      <LandingPage
        theme={theme}
        color={color}
        btnTheme={btnTheme}
        loggedIn={loggedIn}
        firstLogin={firstLogin}
      />
      <ThemeSwitch theme={theme} themeSetter={themeSetter} />
    </div>
  );
}

export default App;
