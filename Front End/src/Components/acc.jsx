import React from "react";
import _ from "lodash";
import ModeEditOutlineTwoToneIcon from "@mui/icons-material/ModeEditOutlineTwoTone";

function Acc(props) {
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

  return (
    <>
      <div id="my-container" className="scroll-enable">
        <div className={"container-fluid p-5 bg-" + props.theme}>
          <div className="row">
            {/* the background div */}
            <div
              className={"col-md-12 background w-100 bg-" + props.oppTheme}
            ></div>

            {/* div containing image */}
            <div className="col-md-3 text-center">
              <img
                alt="Your"
                src="debate4.jpg"
                className={"img border-" + props.theme}
              />
            </div>
            <div className="col-md-1"></div>
            <div className="col-md-8">
              <div className="row">
                <button
                  className="edit-btn mx-auto col-sm-3 btn btn-lg rounded-3 btn-outline-info"
                  type="submit"
                  onClick={props.handleEditDetails}
                >
                  Edit User Details
                </button>

                {/* <div className="col-md-1"></div> */}
                <button
                  className="edit-btn mx-auto col-sm-3 btn btn-lg rounded-3 btn-outline-info"
                  type="submit"
                  onClick={props.handleAddAbout}
                >
                  Add / Edit About Section
                </button>
                {/* <div className="col-md-1"></div> */}

                <button
                  className="edit-btn mx-auto col-sm-3 btn btn-lg rounded-3 btn-outline-info"
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
            <div
              className={
                "col-md-3 text-center after-photo mb-3  bg-" +
                props.oppTheme +
                " text-" +
                props.theme
              }
            >
              <div className="row">
                <div className="col-sm-12 my-3">
                  First Name: {_.capitalize(props.cookies.user.fName)}
                </div>
                <div className="col-sm-12 my-3">
                  Last Name: {_.capitalize(props.cookies.user.lName)}
                </div>
                <div className="col-sm-12 my-3">
                  Email : {props.cookies.user.email}
                </div>
              </div>
            </div>

            {/* stuff on the right */}
            <div className="col-md-1"></div>
            <div className={"col-md-8 mb-3 p-4 right bg-" + props.oppTheme}>
              <div className={"row text-center text-" + props.theme}>
                <div className="col-md-12 h2 heading text-center">
                  {props.cookies.user.user}
                </div>
                {props.keys.map((key) => {
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

            {/* about section */}
            {props.userDetails.about[0].length ? (
              <>
                <div className="col-md-4"></div>
                <div className={"col-md-8 mb-3 p-4 right bg-" + props.oppTheme}>
                  <div
                    className={
                      "col-md-12 h2 heading text-center text-" + props.theme
                    }
                  >
                    About
                  </div>
                  <div className={"text-" + props.theme}>
                    {props.userDetails.about}
                  </div>
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
                        <div className="col-md-4"></div>
                        <div
                          className={
                            "col-md-8 mb-3 p-4 right bg-" + props.oppTheme
                          }
                        >
                          <div
                            className={
                              "col-md-12 h2 heading text-center text-" +
                              props.theme
                            }
                          >
                            <div className="row">
                              <button
                                id={Object.keys(detail)[0]}
                                className="col-sm-1 section-edit-btn btn rounded-3 p-0 mb-1 btn-outline-info"
                              >
                                <ModeEditOutlineTwoToneIcon
                                  onClick={() => {
                                    handleSectionEdit(Object.keys(detail)[0]);
                                  }}
                                />
                              </button>
                              <div className="col-sm-10">
                                {_.startCase(Object.keys(detail)[0])}
                              </div>
                              <button
                                className={
                                  "col-sm-1 p-0 btn-close btn-close-" +
                                  props.oppTheme
                                }
                                id={Object.keys(detail)[0]}
                                aria-label="Close"
                                onClick={deleteSection}
                              ></button>
                            </div>
                          </div>

                          <div className={"text-" + props.theme}>
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
    </>
  );
}
export default Acc;
