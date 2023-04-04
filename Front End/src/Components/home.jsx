import React, { useEffect } from "react";
import Post from "./posts";
import $ from "jquery";

function Home(props) {
  useEffect(() => {
    setDimensions();
  });
  const setDimensions = () => {
    const window = $("html").innerHeight();
    // console.log(window);
    const nav = $("#navBar").outerHeight();
    // console.log(nav);
    $("#my-container").outerHeight(window - nav);
    // console.log(window - nav);
  };

  return (
    <>
      <div id="my-container" className="scroll-enable">
        <div className="container-fluid posts-container">
          <Post user={props.cookies.user} />
          <Post user={props.cookies.user} />
        </div>
      </div>
    </>
  );
}

export default Home;
