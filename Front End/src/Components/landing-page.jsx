import React, { useState } from "react";
import LogIn from "./login";
import Details from "./details";
import SignUp from "./signup";
import Det from "./det";

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
          loggedIn={props.loggedIn}
          closeSignin={closeSignin}
          firstLogin={firstLogin}
        />
        <Details loginShow={loginShow} signupShow={signupShow} />
      </div>
    ) : (
      <Det />
      // <Details loginShow={loginShow} signupShow={signupShow} />
    )
  ) : (
    <div>
      <SignUp closeSignup={closeSignup} />
      <Details loginShow={loginShow} signupShow={signupShow} />
    </div>
  );
}

export default LandingPage;
