import React, { useEffect, useState } from "react";
import _ from "lodash";

function Explore(props) {
  const [usersFound, setUsersFound] = useState([]);
  const [users, setUsers] = useState();
  const [nameString, setNameString] = useState("");

  function getUsers() {
    const address = "http://localhost:8000";
    fetch(address + "/get-all-users", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.msg === "900") {
          const allUsers = [];
          data.users.forEach((user) => {
            if (props.loggedInUser !== user.email) {
              allUsers.push(user);
            }
          });
          setUsers(allUsers);
        }
      });
  }
  useEffect(() => {
    if (!users) {
      getUsers();
    }
  });
  function showUserAccount(e) {
    var email;
    if (e.target.id) {
      email = e.target.id;
    } else {
      email = e.target.offsetParent.id;
    }
    props.userClicked(email);
  }
  useEffect(() => {
    if (props.users) {
      setUsersFound(props.users);
    } else {
      setUsersFound([]);
    }
  }, [props.users]);
  function findUser(e) {
    setNameString("");
    let search = e.target.value;
    if (search === "") {
      setUsersFound([]);
      setNameString("");
    } else {
      setNameString(() => {
        return search;
      });
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        let currentUser = "";
        for (let j = 0; j < user.name.length; j++) {
          currentUser = currentUser + user.name[j];
          if (nameString === currentUser) {
            let alreadyThere = false;
            usersFound.forEach((userAlready) => {
              if (user.email === userAlready.email) {
                alreadyThere = true;
              }
            });
            if (!alreadyThere) {
              setUsersFound((prev) => {
                return [...prev, user];
              });
            }
          }
        }
      }
    }
  }

  return usersFound.length ? (
    <div id="my-container" className="scroll-enable">
      <div className="container p-4">
        <div className="row">
          <div className="col-sm-2"></div>
          <div className="col-sm-8">
            <form className="mt-3">
              <input
                className="form-control mb-1 my-input"
                onChange={findUser}
                type="search"
                id="userSearched"
                name="userSearched"
                placeholder="Search"
                aria-label="Search"
              />
              <hr />
              <button className="w-100 btn rounded-3 btn-color-1" type="submit">
                Search
              </button>
            </form>
          </div>
          <div className="col-sm-2"></div>
        </div>
        <div className="row mt-5">
          {usersFound.map((user) => {
            return (
              <>
                <div className="col-sm-3"></div>
                <div
                  id={user.email}
                  onClick={showUserAccount}
                  className="card user-searched bg-color p-3 post col-sm-6 mb-3"
                >
                  <div className="row">
                    <div className="col-sm-12">
                      {user.pic.length ? (
                        <>
                          <img
                            alt="Your"
                            src={user.pic}
                            className="img photo-post"
                          />
                          <span className="text-color-main">
                            {user.fName
                              ? _.startCase(user.fName + " " + user.lName)
                              : _.startCase(user.name)}
                            {" (" + _.startCase(user.user) + ")"}
                          </span>
                        </>
                      ) : (
                        <>
                          <>
                            <div className="img photo-post-placeholder" />
                            <span className="placeholder-image-name text-color-main">
                              {user.fName
                                ? _.startCase(user.fName + " " + user.lName)
                                : _.startCase(user.name)}
                              {" (" + _.startCase(user.user) + ")"}
                            </span>
                          </>
                        </>
                      )}
                    </div>
                    <div className="col-sm-2"></div>
                    <div className="col-sm-10">
                      <span className="text-color-sec">{user.email}</span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-3"></div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  ) : users ? (
    <div id="my-container" className="scroll-enable">
      <div className="container  p-4 ">
        <div className="row">
          <div className="col-sm-2"></div>
          <div className="col-sm-8">
            <form className="mt-3">
              <input
                className="form-control mb-1 my-input"
                onChange={findUser}
                type="search"
                id="userSearched"
                name="userSearched"
                placeholder="Search"
                aria-label="Search"
              />
              <hr />
              <button className="w-100 btn rounded-3 btn-color-1" type="submit">
                Search
              </button>
            </form>
          </div>
          <div className="col-sm-2"></div>
        </div>
        <div className="row mt-5">
          {users.map((user) => {
            return (
              <>
                <div className="col-sm-3"></div>
                <div
                  onClick={showUserAccount}
                  id={user.email}
                  className="card user-searched bg-color p-3 post col-sm-6 mb-3"
                >
                  <div className="row">
                    <div className="col-sm-12">
                      {user.pic.length ? (
                        <>
                          <img
                            alt="Your"
                            src={user.pic}
                            className="img photo-post"
                          />
                          <span className="text-color-main">
                            {_.startCase(user.name) +
                              " (" +
                              _.startCase(user.user) +
                              ")"}
                          </span>
                        </>
                      ) : (
                        <>
                          <>
                            <div className="img photo-post-placeholder" />
                            <span className="placeholder-image-name text-color-main">
                              {_.startCase(user.name) +
                                " (" +
                                _.startCase(user.user) +
                                ")"}
                            </span>
                          </>
                        </>
                      )}
                    </div>
                    <div className="col-sm-2"></div>
                    <div className="col-sm-10">
                      <span className="text-color-sec">{user.email}</span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-3"></div>
              </>
            );
          })}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default Explore;
