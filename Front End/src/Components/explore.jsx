import React, { useEffect, useState } from "react";
import _ from "lodash";

function Explore(props) {
  const [usersFound, setUsersFound] = useState();
  const [users, setUsers] = useState();

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
      setUsersFound();
    }
  }, [props.users]);
  console.log(users);
  return (
    <>
      <div className="row">
        <div className="col-2"></div>
        <div className="col-8">
          <form className="mt-3">
            <input
              className="form-control mb-1 my-input"
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
