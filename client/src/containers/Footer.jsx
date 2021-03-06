import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../img/picnic_notag.svg";
import github from "../img/github-white.svg";

const Footer = props => (
  <footer className="footer">
    <div className="footer__left">&copy; 2018</div>
    <div className="footer__center">
      <NavLink
        to="/"
        className="footer__logo-wrap"
        activeClassName="footer__logo-wrap--active"
      >
        <img src={logo} className="footer__logo" alt="picnic" />
      </NavLink>
    </div>
    <div className="footer__right">
      <a
        href="https://github.com/rifkegribenes/picnic"
        rel="noopener noreferrer"
        target="_blank"
        className="footer__link"
      >
        <img src={github} className="footer__icon" alt="github" />
      </a>
    </div>
  </footer>
);

export default Footer;
