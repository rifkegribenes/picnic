import React from "react";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";

const CardMini = props => (
  <Link
    to={`/park/${props.park._id}`}
    className="parks-grid__card"
    key={props.park._id}
  >
    <div className="parks-grid__title parks-grid__title--sm">
      {props.park.name}
    </div>
    <div className="parks-grid__image-wrap">
      <img className="parks-grid__image" src={props.park.image_url} />
    </div>
  </Link>
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
