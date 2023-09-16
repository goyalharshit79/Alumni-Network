import React, { useState } from "react";
import FirstLogin from "./firstLogin";
import Acc from "./acc";
import AddAbout from "./addAbout";
import AddSection from "./addSection";

function Account(props) {
  const [editDetails, setEditDetails] = useState(false);
  const [addAbout, setAddAbout] = useState(false);
  const [addSection, setAddSection] = useState(false);
  const [sectionFrom, setSectionFrom] = useState("add");
  const [whichSection, setWhichSection] = useState();

  function handleEditDetails() {
    setEditDetails(true);
  }
  function closeEditDetails() {
    setEditDetails(false);
  }
  function handleAddAbout() {
    setAddAbout(true);
  }
  function closeAddAbout() {
    setAddAbout(false);
  }
  function handleAddSection(section, from) {
    if (from) {
      setWhichSection(section);
      setSectionFrom(from);
    }
    setAddSection(true);
  }
  function closeAddSection() {
    setWhichSection();
    setSectionFrom("add");
    setAddSection(false);
  }
  return editDetails ? (
    <>
      <FirstLogin
        user={props.cookies.user}
        closeFirstLogin={closeEditDetails}
        updateDetails={props.updateDetails}
        userDetails={props.userDetails}
        from={"account"}
      />
      <div className="scroll-enable">
        <Acc
          cookies={props.cookies}
          userDetails={props.userDetails}
          closeFirstLogin={props.closeFirstLogin}
          updateDetails={props.updateDetails}
          handleEditDetails={handleEditDetails}
          handleAddAbout={handleAddAbout}
          handleAddSection={handleAddSection}
          // keys={keys}
        />
      </div>
    </>
  ) : addAbout ? (
    <>
      <AddAbout
        cookies={props.cookies}
        closeAddAbout={closeAddAbout}
        updateDetails={props.updateDetails}
        userDetails={props.userDetails}
      />
      <Acc
        cookies={props.cookies}
        userDetails={props.userDetails}
        closeFirstLogin={props.closeFirstLogin}
        updateDetails={props.updateDetails}
        handleEditDetails={handleEditDetails}
        handleAddAbout={handleAddAbout}
        handleAddSection={handleAddSection}
        // keys={keys}
      />
    </>
  ) : addSection ? (
    <>
      <AddSection
        closeAddSection={closeAddSection}
        updateDetails={props.updateDetails}
        userDetails={props.userDetails}
        sectionFrom={sectionFrom}
        whichSection={whichSection}
      />
      <Acc
        cookies={props.cookies}
        userDetails={props.userDetails}
        closeFirstLogin={props.closeFirstLogin}
        updateDetails={props.updateDetails}
        handleEditDetails={handleEditDetails}
        handleAddAbout={handleAddAbout}
        handleAddSection={handleAddSection}
        // keys={keys}
      />
    </>
  ) : (
    <>
      <Acc
        cookies={props.cookies}
        userDetails={props.userDetails}
        closeFirstLogin={props.closeFirstLogin}
        updateDetails={props.updateDetails}
        handleEditDetails={handleEditDetails}
        handleAddAbout={handleAddAbout}
        handleAddSection={handleAddSection}
        // keys={keys}
      />
    </>
  );
}
export default Account;
