import React from "react";
import $ from "jquery";

function NavBar(props) {
  function tabChange(e) {
    props.tabChange(e.target);
    switchActive(e);
    $("#close-btn").click();
  }
  function switchActive(e) {
    const elements = $("a");
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.remove("my-active");
      if (elements[i] === e.target) {
        elements[i].classList.add("my-active");
      }
    }
  }

  return (
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
                  <a
                    className="nav-link my-active text-color-sec"
                    aria-current="page"
                    href="/#"
                    onClick={tabChange}
                  >
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link text-color-sec"
                    href="/#"
                    onClick={tabChange}
                  >
                    Account
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link text-color-sec"
                    href="/#"
                    onClick={props.logout}
                  >
                    Log Out
                  </a>
                </li>
              </ul>
              <form className="d-flex mt-3 mt-lg-0" role="search">
                <input
                  className="form-control me-2 my-input"
                  type="search"
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
  );
}

export default NavBar;
