import React from "react";
import $ from "jquery";

function NavBar(props) {
  function tabChange(e) {
    props.tabChange(e.target.innerHTML);
    // switchActive(e);
    $("#close-btn").click();
  }
  // function switchActive(e) {
  //   const elements = $("a");
  //   for (let i = 0; i < elements.length; i++) {
  //     elements[i].classList.remove("my-active");
  //     if (elements[i] === e.target) {
  //       elements[i].classList.add("my-active");
  //     }
  //   }
  // }
  function searchUser(e) {
    e.preventDefault();
    const address = "http://localhost:8000";
    const data = new FormData(e.currentTarget);
    const reqData = {
      userSearched: data.get("userSearched"),
    };
    fetch(address + "/search-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqData),
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.msg === "900") {
          props.tabChange("Explore", data.usersFound);
        } else if (data.msg === "901") {
          console.log("No users found");
          props.tabChange("Explore");
        } else {
          console.log("something went wrong bro");
          props.tabChange("Explore", data.usersFound);
        }
        $("#userSearched")[0].value = "";
        $("#close-btn").click();
      })
      .catch((err) => console.log(err));
  }
  return props.from === "Explore" ? (
    <div id="navBar" className="text-color-sec">
      <nav
        className="navbar navbar-expand-lg bg-color "
        aria-label="Offcanvas navbar large"
      >
        <div className="container-fluid">
          <span className="navbar-brand mb-0 text-color-main">
            Alumni Network
          </span>
          <div className="explore-search">
            <form
              className="d-flex mt-3 mt-lg-0"
              onSubmit={searchUser}
              role="search"
            >
              <input
                className="form-control me-2 my-input"
                type="search"
                id="userSearched"
                name="userSearched"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-color-1 " type="submit">
                Search
              </button>
            </form>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="offcanvas offcanvas-end bg-color"
            tabIndex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbar"
          >
            <div className="offcanvas-header">
              <h5
                className="offcanvas-title text-color-main"
                id="offcanvasNavbar"
              >
                Menu
              </h5>
              <button
                type="button"
                id="close-btn"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav  justify-content-end flex-grow-1 pe-3">
                <li className="nav-item">
                  <span className="nav-link text-color-sec" onClick={tabChange}>
                    Home
                  </span>
                </li>
                <li className="nav-item">
                  <span className="nav-link text-color-sec" onClick={tabChange}>
                    Explore
                  </span>
                </li>
                <li className="nav-item">
                  <span className="nav-link text-color-sec" onClick={tabChange}>
                    Account
                  </span>
                </li>
                <li className="nav-item">
                  <span
                    className="nav-link text-color-sec"
                    onClick={props.logout}
                  >
                    Log Out
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
      <div className="b-example-divider"></div>
    </div>
  ) : (
    <>
      <div id="navBar" className="text-color-sec">
        <nav
          className="navbar navbar-expand-lg bg-color "
          aria-label="Offcanvas navbar large"
        >
          <div className="container-fluid">
            <span className="navbar-brand mb-0 text-color-main">
              Alumni Network
            </span>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasNavbar"
              aria-controls="offcanvasNavbar"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="offcanvas offcanvas-end bg-color"
              tabIndex="-1"
              id="offcanvasNavbar"
              aria-labelledby="offcanvasNavbar"
            >
              <div className="offcanvas-header">
                <h5
                  className="offcanvas-title text-color-main"
                  id="offcanvasNavbar"
                >
                  Menu
                </h5>
                <button
                  type="button"
                  id="close-btn"
                  className="btn-close"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </div>
              <div className="offcanvas-body">
                <ul className="navbar-nav  justify-content-end flex-grow-1 pe-3">
                  <li className="nav-item">
                    <span
                      className="nav-link text-color-sec"
                      onClick={tabChange}
                    >
                      Home
                    </span>
                  </li>
                  <li className="nav-item">
                    <span
                      className="nav-link text-color-sec"
                      onClick={tabChange}
                    >
                      Explore
                    </span>
                  </li>
                  <li className="nav-item">
                    <span
                      className="nav-link text-color-sec"
                      onClick={tabChange}
                    >
                      Account
                    </span>
                  </li>
                  <li className="nav-item">
                    <span
                      className="nav-link text-color-sec"
                      onClick={props.logout}
                    >
                      Log Out
                    </span>
                  </li>
                </ul>
                <form
                  className="d-flex mt-3 mt-lg-0"
                  onSubmit={searchUser}
                  role="search"
                >
                  <input
                    className="form-control me-2 my-input"
                    type="search"
                    id="userSearched"
                    name="userSearched"
                    placeholder="Search"
                    aria-label="Search"
                  />
                  <button className="btn btn-color-1 " type="submit">
                    Search
                  </button>
                </form>
              </div>
            </div>
          </div>
        </nav>
        <div className="b-example-divider"></div>
      </div>
    </>
  );
}

export default NavBar;
