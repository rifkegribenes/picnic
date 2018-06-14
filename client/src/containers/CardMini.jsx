import React from "react";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as apiActions from "../store/actions/apiParkActions";

class CardMini extends React.Component {
  componentWillMount() {
    this.props.api
      .viewPark(this.props.park.id)
      .then(result => {
        console.log(this.props.parkState.parks);
      })
      .catch(err => {
        console.log(err);
        return null;
      });
  }

  componentWillReceiveProps(nextProps) {
    // check to see if guestlist has changed
    // this still isn't working but try this tomorrow -- force rerender
    // if guestList changes... or save 'checked in' value to component state?
    if (
      this.props.park.guestList &&
      this.props.park.guestList.length !== nextProps.park.guestList.length
    ) {
      this.props.api
        .viewPark(this.props.park.id)
        .then(result => {
          console.log("cWU");
          console.log(result);
          if (result === "VIEW_PARK_SUCCESS") {
            console.log(
              `parks array successfully updated with mongo data for park ID = ${
                this.props.park.id
              }`
            );
            console.log(this.props.park.parks);
          }
        })
        .catch(err => {
          console.log(err);
          return null;
        });
    }
  }

  render() {
    return (
      <div key={this.props.park.id} className="parks-grid__card">
        <div className="parks-grid__title--sm">
          <Link to={this.props.park.url} className="parks-grid__title">
            {this.props.park.name}
          </Link>
        </div>
        <div className="parks-grid__image-wrap">
          <img
            className="parks-grid__image"
            src={this.props.park.image_url}
            alt={this.props.park.name}
          />
        </div>
        <div className="parks-grid__review-wrap" />
        <div className="parks-grid__contact-info-wrap">
          {this.props.park.location.display_address[0]}
          <br />
          {this.props.park.location.display_address[1]}
          <br />
          <a
            className="parks-grid__phone"
            href={`tel:${this.props.park.phone}`}
          >
            {this.props.park.display_phone}
          </a>
        </div>
        <div className="parks-grid__button-wrap">
          <button
            className="form__button"
            onClick={() =>
              this.props.checkIn(this.props.park.id, this.props.userId)
            }
          >
            {this.props.park.guests &&
            this.props.park.guests.indexOf(this.props.userId) !== -1
              ? "Check Out"
              : "Check In"}
          </button>
        </div>
        <div className="parks-grid__guestlist">
          {`${
            this.props.park.guests ? this.props.park.guests.length : "0"
          } users checked in`}
        </div>
      </div>
    );
  }
}

CardMini.propTypes = {
  park: PropTypes.shape({
    _id: PropTypes.string,
    question: PropTypes.string,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
        _id: PropTypes.string
      })
    ),
    ownerId: PropTypes.string,
    ownerName: PropTypes.string
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
};

const mapStateToProps = state => ({
  appState: state.appState,
  profile: state.profile,
  parkState: state.park
});

const mapDispatchToProps = dispatch => ({
  api: bindActionCreators(apiActions, dispatch)
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CardMini)
);
