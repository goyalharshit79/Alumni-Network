import React, { useState } from "react";
import LogIn from "./login";
import Details from "./details";
import SignUp from "./signup";

function LandingPage(props) {
  const [wantsToLogin, setWantsToLogin] = useState(false);
  const [isRegistered, setIsRegistered] = useState(true);

  function loginShow() {
    setWantsToLogin(true);
  }
  function closeSignin() {
    setWantsToLogin(false);
  }
  function signupShow() {
    setIsRegistered(false);
  }
  function closeSignup() {
    setIsRegistered(true);
  }
  function firstLogin() {
    props.firstLogin();
  }

  return isRegistered ? (
    wantsToLogin ? (
      <div>
        <LogIn
          theme={props.theme}
          color={props.color}
          loggedIn={props.loggedIn}
          closeSignin={closeSignin}
          firstLogin={firstLogin}
        />
        <Details
          loginShow={loginShow}
          theme={props.theme}
          color={props.color}
          btnTheme={props.btnTheme}
          signupShow={signupShow}
        />
      </div>
    ) : (
      <Details
        loginShow={loginShow}
        theme={props.theme}
        color={props.color}
        btnTheme={props.btnTheme}
        signupShow={signupShow}
      />
    )
  ) : (
    <div>
      <SignUp
        theme={props.theme}
        color={props.color}
        closeSignup={closeSignup}
      />
      <Details
        loginShow={loginShow}
        theme={props.theme}
        color={props.color}
        btnTheme={props.btnTheme}
        signupShow={signupShow}
      />
    </div>
  );
}

export default LandingPage;
