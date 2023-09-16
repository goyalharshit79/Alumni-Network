import React, { useState } from "react";
import LogIn from "./login";
import Details from "./details";
import SignUp from "./signup";
import Alert from "./alert";

function LandingPage(props) {
  const [wantsToLogin, setWantsToLogin] = useState(false);
  const [badLogin, setBadLogin] = useState(false);
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
  function handleBadLogin() {
    setBadLogin(true);
  }
  return isRegistered ? (
    wantsToLogin ? (
      <div>
        {badLogin && (
          <>
            <Alert
              type="danger"
              message="Username or Password is wrong, if you don't already have an account, please Sign Up first!"
              closeAlert={() => {
                setTimeout(() => {
                  setBadLogin(false);
                }, 100);
              }}
            />
          </>
        )}
        <LogIn
          handleBadLogin={handleBadLogin}
          loggedIn={props.loggedIn}
          closeSignin={closeSignin}
          firstLogin={firstLogin}
        />
        <Details loginShow={loginShow} signupShow={signupShow} />
      </div>
    ) : (
      // <Det />
      <Details loginShow={loginShow} signupShow={signupShow} />
    )
  ) : (
    <div>
      <SignUp closeSignup={closeSignup} />
      <Details loginShow={loginShow} signupShow={signupShow} />
    </div>
  );
}

export default LandingPage;
