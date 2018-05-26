import React from "react";
import { withRouter, Link } from "react-router-dom";
import PropTypes from "prop-types";

import editIcon from "../img/edit.svg";
import deleteIcon from "../img/delete.svg";
import twIcon from "../img/twitter.svg";
import fbIcon from "../img/facebook-white.svg";
import tmIcon from "../img/tumblr.svg";

const deleteModal = (parkId, token, deletePark) => {
  return {
    title: "Confirm Delete",
    buttonText: "Delete",
    modalDanger: true,
    action: () => deletePark(token, parkId),
    message: "Are you sure you want to delete this park? This cannot be undone."
  };
};

const Card = props => {
  const backgroundStyle = {
    backgroundImage: `url(${props.park.ownerAvatar ||
      "https://raw.githubusercontent.com/rifkegribenes/picnic/master/client/public/img/picnic_icon.png"})`,
    backgroundSize: "cover",
    backgroundPosition: "center center"
  };
  const canonicalUrl = encodeURIComponent(
    `https://picnic.glitch.me/park/${props.park._id}`
  );
  const questionUriEncoded = encodeURIComponent(props.park.question);
  const tumblrUrl = `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${canonicalUrl}&posttype=link&description=${questionUriEncoded}&caption=${questionUriEncoded}`;

  return (
    <div key={props.park._id}>
      <div
        className={
          props.owner
            ? "parks-grid__card parks-grid__card--single parks-grid__card--owner"
            : "parks-grid__card parks-grid__card--single"
        }
      >
        <div className="parks-grid__title">{props.park.question}</div>
        <div className="parks-grid__inner-wrap">
          <div className="parks-grid__options-wrap">
            {props.park.options[0].text !== "" &&
              props.park.options.map((option, idx) => (
                <button
                  key={option._id || idx}
                  className="parks-grid__option form__button"
                  onClick={() => {
                    const body = { ...props.park };
                    props.vote(props.park._id, option._id, body);
                  }}
                >
                  {option._id !== undefined && option.text}
                </button>
              ))}
          </div>
        </div>
        <div className="parks-grid__icon-wrap">
          <a
            className="form__button parks-grid__btn--icon"
            href={`http://www.facebook.com/sharer.php?u=${canonicalUrl}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="form__icon parks-grid__icon"
              alt="facebook"
              src={fbIcon}
            />
          </a>
          <a
            className="form__button parks-grid__btn--icon"
            href={`https://twitter.com/share?url=${canonicalUrl}&text=${questionUriEncoded}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="form__icon parks-grid__icon"
              alt="twitter"
              src={twIcon}
            />
          </a>
          <a
            className="form__button parks-grid__btn--icon"
            href={tumblrUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="form__icon parks-grid__icon"
              alt="tumblr"
              src={tmIcon}
            />
          </a>
        </div>
        {props.owner ? (
          <div className="parks-grid__admin-buttons">
            <button
              className="form__button parks-grid__btn--icon parks-grid__edit"
              title="Edit park"
              onClick={() => props.history.push(`/edit/${props.park._id}`)}
            >
              <img
                className="form__icon parks-grid__icon"
                alt=""
                src={editIcon}
              />
            </button>
            <button
              className="form__button parks-grid__btn--icon"
              title="Delete park"
              onClick={() =>
                props.setModalError(
                  deleteModal(props.park._id, props.token, props.deletePark)
                )
              }
            >
              <img
                className="form__icon parks-grid__icon"
                alt=""
                src={deleteIcon}
              />
            </button>
          </div>
        ) : (
          <Link
            to={`/userparks/${props.park.ownerId}`}
            className="h-nav__image-aspect parks-grid__avatar"
          >
            <div className="h-nav__image-crop">
              <div
                className="h-nav__image"
                style={backgroundStyle}
                role="img"
                aria-label={props.park.ownerName}
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

Card.propTypes = {
  token: PropTypes.string.isRequired,
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
  deletePark: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired,
  owner: PropTypes.bool.isRequired,
  single: PropTypes.bool,
  setModalError: PropTypes.func,
  vote: PropTypes.func,
  voted: PropTypes.bool
};

export default withRouter(Card);
