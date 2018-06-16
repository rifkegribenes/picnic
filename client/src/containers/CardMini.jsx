import React from "react";
import { withRouter } from "react-router-dom";
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
        this.setState({
          parkId: this.props.parkState.currentPark.id,
          guestList: this.props.parkState.currentPark.guestList
        });
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
          <a
            href={this.props.park.url}
            className="parks-grid__title"
            target="_blank"
          >
            {this.props.park.name}
          </a>
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
            onClick={() => {
              this.props.api
                .checkIn(this.props.park.id, this.props.userId)
                .then(() =>
                  this.setState({
                    parkId: this.props.parkState.currentPark.id,
                    guestList: this.props.parkState.currentPark.guestList
                  })
                );
            }}
          >
            {this.state.guestList &&
            this.state.guestList.indexOf(this.props.userId) !== -1
              ? "Check Out"
              : "Check In"}
          </button>
        </div>
        <div className="parks-grid__guestlist">
          {`${this.state.guestList.length} users checked in`}
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
