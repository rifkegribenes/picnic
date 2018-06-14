import React from "react";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as apiActions from "../store/actions/apiParkActions";

class CardMini extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      parkId: "",
      guestList: []
    };
  }
  componentWillMount() {
    this.props.api
      .getGuestlist(this.props.park.id)
      .then(result => {
        this.setState(
          {
            parkId: this.props.parkState.currentPark.id,
            guestList: this.props.parkState.currentPark.guestList
          },
          () => {
            if (this.state.guestList.length) {
              console.log(this.state);
            }
          }
        );
      })
      .catch(err => {
        console.log(err);
        return null;
      });
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
            {this.state.guestList &&
            this.state.guestList.indexOf(this.props.userId) !== -1
              ? "Check Out"
              : "Check In"}
          </button>
        </div>
        <div className="parks-grid__guestlist">
          {`${
            this.state.guestList ? this.state.guestList.length : "0"
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
