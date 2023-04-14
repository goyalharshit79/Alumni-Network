import React, { useState, useEffect } from "react";
import Explore from "./explore";
import { useCookies } from "react-cookie";
import Acc from "./acc";

function ExplorePage(props) {
  const [user, setUser] = useState();
  const [userDetails, setUserDetails] = useState();
  const [keys, setKeys] = useState([]);

  // useEffect(() => {
  //   setKeys(() => {
  //     var toFilter = Object.keys(props.userDetails);
  //     toFilter = toFilter.filter((key) => {
  //       return (
  //         key !== "__v" &&
  //         key !== "_id" &&
  //         key !== "email" &&
  //         key !== "about" &&
  //         key !== "additionalDetails"
  //       );
  //     });
  //     return toFilter;
  //   });
  // }, [props.userDetails]);

  return true ? (
    <>
      <Acc user={user} userDetails={userDetails} from="explore" />
    </>
  ) : (
    <>
      <Explore users={props.users} userClicked={handleUserClicked} />
    </>
  );
}

export default ExplorePage;
