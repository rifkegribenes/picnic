import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as apiActions from "../store/actions/apiParkActions";
import * as apiActions2 from "../store/actions/apiActions";

class CardMini extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      parkId: "",
      guestList: []
    };
  }
  componentDidMount() {
    this.props.api
      .getGuestlist(this.props.park.id)
      .then(result => {
        if (this.props.parkState.currentPark.guestList.length) {
          console.log(this.props.parkState.currentPark.guestList);
          this.setState(
            {
              parkId: this.props.parkState.currentPark.id,
              guestList: this.props.parkState.currentPark.guestList
            },
            () => console.log(this.state.guestList)
          );
        }
      })
      .catch(err => {
        console.log(err);
        return null;
      });
  }

  render() {
    let guestList;
    let checkedIn = false;
    if (
      this.state.guestList.length > 0 &&
      this.state.guestList[0] !== null &&
      this.state.guestList[0] !== undefined &&
      this.state.guestList[0] !== {}
    ) {
      console.log(this.state.guestList);
      checkedIn = this.state.guestList.find(guest => {
        return guest.id === this.props.userId;
      });
      guestList = this.state.guestList.map((guest, idx) => {
        const backgroundStyle = {
          backgroundImage: `url(${guest.avatarUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center center"
        };
        return (
          <div className="parks-grid__guest-wrap" key={`${guest.id}_${idx}`}>
            <div className="h-nav__image-aspect">
              <div className="h-nav__image-crop">
                <div
                  className="h-nav__image"
                  style={backgroundStyle}
                  role="img"
                  aria-label={guest.firstName}
                />
              </div>
            </div>
          </div>
        );
      });
    }

    if (checkedIn) {
      console.log(`${this.props.park.name}: checkedIn = ${checkedIn}`);
    }
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
            {checkedIn ? "Check Out" : "Check In"}
          </button>
        </div>
        <div className="parks-grid__guestlist">
          {`${this.state.guestList.length} users checked in`}
        </div>
        <div className="parks-grid__guestlist-wrap">
          {this.state.guestList.length ? guestList : ""}
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
  api: bindActionCreators(apiActions, dispatch),
  api2: bindActionCreators(apiActions2, dispatch)
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CardMini)
);
