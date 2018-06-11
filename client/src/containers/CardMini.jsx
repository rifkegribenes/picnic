import React from "react";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";

const CardMini = props => (
  <div key={props.park.id} className="parks-grid__card">
    <div className="parks-grid__title--sm">
      <Link to={props.park.url} className="parks-grid__title">
        {props.park.name}
      </Link>
    </div>
    <div className="parks-grid__image-wrap">
      <img
        className="parks-grid__image"
        src={props.park.image_url}
        alt={props.park.name}
      />
    </div>
    <div className="parks-grid__review-wrap" />
    <div className="parks-grid__contact-info-wrap">
      {props.park.location.display_address[0]}
      <br />
      {props.park.location.display_address[1]}
      <br />
      <a className="parks-grid__phone" href={`tel:${props.park.phone}`}>
        {props.park.display_phone}
      </a>
    </div>
    <div className="parks-grid__button-wrap">
      <button
        className="form__button"
        onClick={() => props.checkIn(props.park.id, props.userId)}
      >
        Check In
      </button>
    </div>
  </div>
);

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

export default withRouter(CardMini);
