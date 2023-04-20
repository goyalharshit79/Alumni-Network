import React, { useEffect, useState } from "react";
import _ from "lodash";
// import ModeEditOutlineTwoToneIcon from "@mui/icons-material/ModeEditOutlineTwoTone";

function Acc(props) {
  const [profilePic, setProfilePic] = useState();
  const [user, setUser] = useState();
  const [showOptions, setShowOptions] = useState();
  useEffect(() => {
    if (!profilePic) {
      getPhoto();
    }
  });
  useEffect(() => {
    if (!user) {
      getUser();
    }
  });
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    setKeys(() => {
      if (props.from === "explore") {
        if (props.userClicked) {
          let toClickedFilter = Object.keys(props.userClicked);
          toClickedFilter = toClickedFilter.filter((key) => {
            return (
              key !== "__v" &&
              key !== "_id" &&
              key !== "email" &&
              key !== "about" &&
              key !== "additionalDetails"
            );
          });
          return toClickedFilter;
        }
      } else {
        var toFilter = Object.keys(props.userDetails);
        toFilter = toFilter.filter((key) => {
          return (
            key !== "__v" &&
            key !== "_id" &&
            key !== "email" &&
            key !== "about" &&
            key !== "additionalDetails"
          );
        });
        return toFilter;
      }
    });
  }, [props.userDetails, props.from, props.userClicked]);

  function deleteSection(e) {
    const address = "http://localhost:8000";
    e.preventDefault();
    const reqPayload = {
      email: props.userDetails.email,
      toDelete: e.target.id,
    };
    fetch(address + "/delete-section", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqPayload),
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        props.updateDetails();
      })
      .catch((err) => console.log(err));
  }
  function handleSectionEdit(section) {
    props.handleAddSection(section, "edit");
  }
  function getPhoto() {
    const address = "http://localhost:8000";
    var reqPayload;
    if (props.from === "explore") {
      reqPayload = {
        email: props.user,
      };
    } else {
      // console.log("pic from props");
      reqPayload = { email: props.userDetails.email };
    }

    fetch(address + "/get-user-pic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqPayload),
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.msg === "900") {
          setProfilePic(data.pic);
        }
      })
      .catch((err) => console.log(err));
  }
  function getUser() {
    const address = "http://localhost:8000";
    var reqPayload;
    if (props.from === "explore") {
      reqPayload = {
        email: props.user,
      };
    } else {
      reqPayload = { email: props.userDetails.email };
    }
    fetch(address + "/retain-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqPayload),
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data.user);
      })
      .catch((err) => console.log(err));
  }
  function handleAddPic(e) {
    const pic = e.target.files;
    const reader = new FileReader();
    reader.readAsDataURL(pic[0]);
    reader.onload = () => {
      const address = "http://localhost:8000";
      const reqPayload = {
        email: props.userDetails.email,
        pic: reader.result,
      };
      fetch(address + "/update-user-pic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqPayload),
        mode: "cors",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.msg === "900") {
            setProfilePic(data.pic);
          }
        })
        .catch((err) => console.log(err));
    };
  }
  function handleShowOptions(e) {
    setShowOptions(e.target.classList[e.target.classList.length - 1]);
  }
  function handleCloseOptions(e) {
    if (e.target.id !== "options") {
      setShowOptions(false);
    }
  }
  // console.log(user);
  // console.log(keys);
  // console.log(userDetails);
  return props.from === "explore" ? (
    user ? (
      <div id="my-container" className="scroll-enable">
        <div className="container-fluid p-5">
          <div className="row">
            {/* the background div */}
            <div className="col-md-12 background w-100 bg-color"></div>

            {/* div containing image */}
            <div className="col-md-3 text-center">
              {profilePic ? (
                profilePic.length ? (
                  <img
                    className="img-placeholder border-white"
                    src={profilePic}
                    alt="Your Pic"
                  />
                ) : (
                  <div className="img-placeholder mx-auto border-white"></div>
                )
              ) : (
                <div className="img-placeholder mx-auto border-white"></div>
              )}
            </div>
            <div className="col-md-1"></div>
            <div className="col-md-8"></div>
            {/* stuff after image */}
            <div className="col-md-3 text-center after-photo mb-3 bg-color text-color-sec">
              <div className="row">
                <div className="col-sm-12 my-3 ">
                  First Name: {_.capitalize(user.fName)}
                </div>
                <div className="col-sm-12 my-3">
                  Last Name: {_.capitalize(user.lName)}
                </div>
                <div className="col-sm-12 my-3">Email : {user.email}</div>
              </div>
            </div>
            <div className="col-md-1"></div>
            <div className="col-md-8 mb-3 p-4 right bg-color">
              <div className="row text-center text-color-sec">
                <div className="col-md-12 h2 heading text-center text-color-main">
                  {user.user}
                </div>
                {keys ? (
                  props.userClicked ? (
                    keys.map((key) => {
                      return (
                        <div className="list-group">
                          <div className="list-group-item mb-2 list-group-item-action d-flex gap-3">
                            <span className="col-sm-3 mx-2 flex-shrink-0 ">
                              {_.startCase(key)}:
                            </span>
                            <div className="row">
                              {props.userClicked[key].map((value) => {
                                return props.userClicked[key].length === 1 ? (
                                  <span className="col-sm-12 d-flex gap-2 justify-content-between">
                                    {_.startCase(value)}
                                  </span>
                                ) : (
                                  <span className="col-sm-12 d-flex gap-2 justify-content-between">
                                    <ul>
                                      <li>{_.startCase(value)}</li>
                                    </ul>
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <></>
                  )
                ) : (
                  <></>
                )}
              </div>
            </div>
            {props.userClicked ? (
              props.userClicked.about[0].length ? (
                <>
                  <div className="col-md-4"></div>
                  <div className="col-md-8 mb-3 p-4 right bg-color">
                    <div className="col-md-12 h2 heading text-center text-color-main">
                      About
                    </div>
                    <div className="text-color-sec">
                      {props.userClicked.about}
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
            {/* if sections are added  */}

            {props.userClicked?.additionalDetails.length >= 1 ? (
              <>
                {props.userClicked.additionalDetails.map((detail) => {
                  if (detail !== "") {
                    return (
                      <>
                        <div className="col-md-4"></div>
                        <div className="col-md-8 mb-3 p-4 right bg-color">
                          <div className="col-md-12 h2 heading text-center textcolor-main">
                            <div className="row mb-1">
                              <div className="col-sm-10">
                                {_.startCase(Object.keys(detail)[0])}
                              </div>
                            </div>
                          </div>
                          <div className="text-color-sec">
                            {detail[Object.keys(detail)[0]].length > 1 ? (
                              detail[Object.keys(detail)[0]].map((det) => {
                                return (
                                  <ul>
                                    <li>{_.capitalize(det)}</li>
                                  </ul>
                                );
                              })
                            ) : (
                              <>
                                <ul>
                                  <li>
                                    {_.capitalize(
                                      detail[Object.keys(detail)[0]]
                                    )}
                                  </li>
                                </ul>
                              </>
                            )}
                          </div>
                        </div>
                      </>
                    );
                  } else {
                    return <></>;
                  }
                })}
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    ) : (
      <></>
    )
  ) : (
    // if its opened to show the users own account

    <div
      id="my-container"
      onClick={handleCloseOptions}
      className="scroll-enable"
    >
      <div className="container-fluid p-5">
        <div className="row">
          {/* the background div */}
          <div className="col-md-12 background w-100 bg-color"></div>

          {/* div containing image */}
          <div className="col-md-3 text-center">
            <input
              className="form-control mb-3 visually-hidden"
              type="file"
              id="files"
              name="files"
              accept="image/*"
              onChange={handleAddPic}
            />
            <label htmlFor="files">
              {profilePic ? (
                profilePic.length ? (
                  <img
                    className="img-placeholder border-white"
                    src={profilePic}
                    alt="Your Pic"
                  />
                ) : (
                  <div className="img-placeholder mx-auto border-white"></div>
                )
              ) : (
                <div className="img-placeholder mx-auto border-white"></div>
              )}
            </label>
          </div>
          <div className="col-md-1"></div>
          <div className="col-md-8">
            <div className="row">
              <button
                className="edit-btn mx-auto col-sm-3 btn btn-lg rounded-3 btn-color-2"
                type="submit"
                onClick={props.handleEditDetails}
              >
                Edit User Details
              </button>

              {/* <div className="col-md-1"></div> */}
              <button
                className="edit-btn mx-auto col-sm-3 btn btn-lg rounded-3 btn-color-2"
                type="submit"
                onClick={props.handleAddAbout}
              >
                Add / Edit About Section
              </button>
              {/* <div className="col-md-1"></div> */}

              <button
                className="edit-btn mx-auto col-sm-3 btn btn-lg rounded-3 btn-color-2"
                type="submit"
                onClick={() => {
                  props.handleAddSection("add");
                }}
              >
                Add a Section
              </button>
            </div>
          </div>

          {/* stuff after image */}
          {user ? (
            <>
              <div className="col-md-3 text-center after-photo mb-3 bg-color text-color-sec">
                <div className="row">
                  <div className="col-sm-12 my-3 ">
                    First Name: {_.capitalize(user.fName)}
                  </div>
                  <div className="col-sm-12 my-3">
                    Last Name: {_.capitalize(user.lName)}
                  </div>
                  <div className="col-sm-12 my-3">Email : {user.email}</div>
                </div>
              </div>
              {/* stuff on the right */}
              <div className="col-md-1"></div>
              <div className="col-md-8 mb-3 p-4 right bg-color">
                <div className="row text-center text-color-sec">
                  <div className="col-md-12 h2 heading text-center text-color-main">
                    {user.user}
                  </div>
                  {keys.map((key) => {
                    return (
                      <div className="list-group">
                        <div className="list-group-item mb-2 list-group-item-action d-flex gap-3">
                          <span className="col-sm-3 mx-2 flex-shrink-0 ">
                            {_.startCase(key)}:
                          </span>
                          <div className="row">
                            {props.userDetails[key].map((value) => {
                              return props.userDetails[key].length === 1 ? (
                                <span className="col-sm-12 d-flex gap-2 justify-content-between">
                                  {_.startCase(value)}
                                </span>
                              ) : (
                                <span className="col-sm-12 d-flex gap-2 justify-content-between">
                                  <ul>
                                    <li>{_.startCase(value)}</li>
                                  </ul>
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <></>
          )}

          {/* about section */}
          {props.userDetails.about[0].length ? (
            <>
              <div className="col-md-4"></div>
              <div className="col-md-8 mb-3 p-4 right bg-color">
                <div className="col-md-12 h2 heading text-center text-color-main">
                  About
                </div>
                <div className="text-color-sec">{props.userDetails.about}</div>
              </div>
            </>
          ) : (
            <></>
          )}

          {/* if sections are added  */}
          {props.userDetails.additionalDetails.length >= 1 ? (
            <>
              {props.userDetails.additionalDetails.map((detail) => {
                if (detail !== "") {
                  return (
                    <>
                      {/* this will show the section */}
                      <div className="col-md-4"></div>
                      <div className="col-md-8 mb-3 p-4 right bg-color">
                        <div className="col-md-12 h2 heading text-center textcolor-main">
                          <div className="section-header mb-1">
                            <div
                              className={
                                "section-menu-container " +
                                Object.keys(detail)[0]
                              }
                              onClick={handleShowOptions}
                              id="options"
                            >
                              <img
                                src="3 dots.png"
                                className={
                                  "section-menu " + Object.keys(detail)[0]
                                }
                                onClick={handleShowOptions}
                                id="options"
                                alt="menu"
                              />
                            </div>

                            {/* will show the menu if the 3 dots are clicked */}
                            {showOptions ? (
                              showOptions === Object.keys(detail)[0] ? (
                                <>
                                  <div
                                    className="options"
                                    id={Object.keys(detail)[0]}
                                  >
                                    <span
                                      id={Object.keys(detail)[0]}
                                      className="options-item"
                                      onClick={() => {
                                        handleSectionEdit(
                                          Object.keys(detail)[0]
                                        );
                                      }}
                                    >
                                      Edit
                                      {/* <ModeEditOutlineTwoToneIcon
                                        onClick={() => {
                                          handleSectionEdit(
                                            Object.keys(detail)[0]
                                          );
                                        }}
                                      /> */}
                                    </span>
                                    <span
                                      className="options-item"
                                      id={Object.keys(detail)[0]}
                                      onClick={deleteSection}
                                    >
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
                            {/* this actually shows you the section */}
                            <div>{_.startCase(Object.keys(detail)[0])}</div>
                          </div>
                        </div>

                        <div className="text-color-sec">
                          {detail[Object.keys(detail)[0]].length > 1 ? (
                            detail[Object.keys(detail)[0]].map((det) => {
                              return (
                                <ul>
                                  <li>{_.capitalize(det)}</li>
                                </ul>
                              );
                            })
                          ) : (
                            <>
                              <ul>
                                <li>
                                  {_.capitalize(detail[Object.keys(detail)[0]])}
                                </li>
                              </ul>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  );
                } else {
                  return <></>;
                }
              })}
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
export default Acc;
