import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./styles.scss";

import AuthContext from "../../../context/auth-context";

const MainNav = (props) => {
  return (
    <AuthContext.Consumer>
      {(context) => {
        return (
          <header className="main-nav">
            <Navbar bg="primary" variant="dark" expand="lg">
              <NavLink to="/">
                <Navbar.Brand>EasyEvent</Navbar.Brand>
              </NavLink>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                  {!context.token && (
                    <NavLink className="nav-link" to="/auth">
                      Auth
                    </NavLink>
                  )}
                  <NavLink className="nav-link" to="/events">
                    Events
                  </NavLink>
                  {context.token && (
                    <>
                      <NavLink className="nav-link" to="/bookings">
                        Bookings
                      </NavLink>
                      <button className="nav-link" onClick={context.logout}>
                        Log Out
                      </button>
                    </>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Navbar>
          </header>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default MainNav;
