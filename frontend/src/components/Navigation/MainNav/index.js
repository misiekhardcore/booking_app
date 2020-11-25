import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./styles.scss";

const MainNav = (props) => {
  return (
    <header className="main-nav">
      <Navbar bg="primary" variant="dark" expand="lg">
        <NavLink to="/">
          <Navbar.Brand>EasyEvent</Navbar.Brand>
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <NavLink className="nav-link" to="/auth">
              Auth
            </NavLink>
            <NavLink className="nav-link" to="/events">
              Events
            </NavLink>
            <NavLink className="nav-link" to="/bookings">
              Bookings
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
};

export default MainNav;
