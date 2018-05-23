import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiActions";
import { typewriterAnimation } from "../utils";

import icon from "../img/picnic_crop.svg";

class Home extends React.Component {
  componentDidMount() {
    // If not logged in, check local storage for authToken
    // if it doesn't exist, it returns the string "undefined"
    if (!this.props.appState.loggedIn) {
      let token = window.localStorage.getItem("authToken");
      if (token && token !== "undefined") {
        token = JSON.parse(token);
        const userId = JSON.parse(window.localStorage.getItem("userId"));
        if (userId) {
          this.props.api.validateToken(token, userId).then(result => {
            if (result === "VALIDATE_TOKEN_FAILURE") {
              console.log("token failed to validate");
            } else if (result === "VALIDATE_TOKEN_SUCESS") {
            }
          });
        }
      } else {
        // console.log("no token found in local storage");
      }
    } else {
      // console.log("logged in");
    }

    typewriterAnimation();
  }

  render() {
    return (
      <div className="splash">
        <div className="splash__logo-wrap">
          <img className="splash__icon" src={icon} alt="picnic" />
          <div id="typewriter" className="splash__headline">
            Create your own polls.
          </div>
          <div className="splash__button-wrap">
            <NavLink
              to="/createpoll"
              className="form__button form__button--big splash__login"
              activeClassName="h-nav__item-link--active"
            >
              Find a park
            </NavLink>
            <NavLink
              to="/polls"
              className="form__button form__button--big splash__button splash__button--polls"
              activeClassName="h-nav__item-link--active"
            >
              Plan a picnic
            </NavLink>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  appState: state.appState,
  profile: state.profile
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
