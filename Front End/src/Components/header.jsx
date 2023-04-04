import React from "react";

function Header() {
  return (
    <header className="text-bg-dark">
      <div className="container-fluid">
        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <h3
            href="/#"
            className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
          >
            Alumni Network
          </h3>
          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li>Home</li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
