import React, { useState } from "react";

export default function Options({ detail }) {
  const [showOptions, setShowOptions] = useState();
  function handleShowOptions(e) {
    setShowOptions(e.target.classList[e.target.classList.length - 1]);
  }
  return (
    <div>
      {" "}
      <div
        className={"section-menu-container " + Object.keys(detail)[0]}
        onClick={handleShowOptions}
        id="options"
      >
        <img
          src="3 dots.png"
          className={"section-menu " + Object.keys(detail)[0]}
          onClick={handleShowOptions}
          id="options"
          alt="menu"
        />
      </div>
      {/* will show the menu if the 3 dots are clicked */}
      {showOptions ? (
        showOptions === Object.keys(detail)[0] ? (
          <>
            <div className="options" id={Object.keys(detail)[0]}>
              <span className="options-item" id={Object.keys(detail)[0]}>
                Delete
              </span>
            </div>
          </>
        ) : (
          <></>
        )
      ) : (
        <></>
      )}
    </div>
  );
}
