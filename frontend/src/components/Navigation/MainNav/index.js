import React from "react";
import { NavLink } from "react-router-dom";
import "./styles.scss";

const MainNav = (props) => {
  return (
    <header className="main-nav">
      <div className="main-nav__logo">
        <NavLink to="/">
          <h1>EasyEvent</h1>
        </NavLink>
      </div>
      <nav className="main-nav__items">
        <ul>
          <li className="main-nav__item">
            <NavLink to="/auth">Auth</NavLink>
          </li>
          <li className="main-nav__item">
            <NavLink to="/events">Events</NavLink>
          </li>
          <li className="main-nav__item">
            <NavLink to="/bookings">Bookings</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainNav;
