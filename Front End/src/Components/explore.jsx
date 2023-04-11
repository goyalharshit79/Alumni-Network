import React, { useEffect, useState } from "react";
import _ from "lodash";

function Explore(props) {
  const [usersFound, setUsersFound] = useState([]);
  const [users, setUsers] = useState();
  const [nameString, setNameString] = useState("");

  function getUsers() {
    const address = "http://localhost:8000";
    fetch(address + "/get-users", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.msg === "900") {
          setUsers(data.users);
        }
      });
  }
  useEffect(() => {
    if (!users) {
      getUsers();
    }
  });

  useEffect(() => {
    if (props.users) {
      setUsersFound(props.users);
    } else {
      setUsersFound([]);
    }
  }, [props.users]);
  function findUser(e) {
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
            // console.log("dding");
            // console.log(user);
            let alreadyThere = false;
            usersFound.forEach((userAlready) => {
              if (user.name === userAlready.name) {
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
    <>
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8">
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
        <div className="col-md-2"></div>
      </div>
      <div className="row mt-5">
        {usersFound.map((user) => {
          return (
            <>
              <div className="col-md-3"></div>
              <div className="card p-3 post col-md-6 mb-3">
                <div className="row">
                  <div className="col-sm-12">
                    <img alt="Your" src={user.pic} className="img photo-post" />

                    <span>{_.startCase(user.name)}</span>
                  </div>
                </div>
              </div>
              <div className="col-md-3"></div>
            </>
          );
        })}
      </div>
    </>
  ) : (
    <>
      <div className="row">
        <div className="col-2"></div>
        <div className="col-8">
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
        <div className="col-2"></div>
      </div>
    </>
  );
}

export default Explore;
