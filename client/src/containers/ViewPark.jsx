import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiParkActions";

import Spinner from "./Spinner";
import ModalSm from "./ModalSm";
import Card from "./Card";

class ViewPark extends React.Component {
  componentWillMount() {
    const parkId = this.props.match.params.id;
    // retrieve requested park & save to app state
    this.props.api.viewPark(parkId).then(result => {
      if (result.type === "VIEW_PARK_SUCCESS") {
      }
    });
  }

  render() {
    return (
      <div>
        <Spinner cssClass={this.props.park.spinnerClass} />
        <ModalSm
          modalClass={this.props.park.modal.class}
          modalText={this.props.park.modal.text}
          modalType={this.props.park.modal.type}
          modalTitle={this.props.park.modal.title}
          inputName={this.props.park.modal.inputName}
          inputPlaceholder={this.props.park.modal.inputPlaceholder}
          inputLabel={this.props.park.modal.inputLabel}
          inputType={this.props.park.modal.inputType}
          buttonText={this.props.park.modal.buttonText}
          modalDanger={this.props.park.modal.modalDanger}
          dismiss={() => {
            this.props.actions.dismissModal();
            if (
              this.props.park.modal.text ===
              "You have already voted in this park"
            ) {
              this.props.history.push("/parks");
            } else if (
              this.props.park.modal.type === "modal__error" &&
              this.props.park.modal.buttonText !== "Delete"
            ) {
              this.props.history.push("/login");
            }
          }}
          redirect={this.props.park.modal.redirect}
          action={() => {
            if (this.props.park.modal.action) {
              this.props.park.modal.action();
            } else {
              this.props.actions.dismissModal();
            }
          }}
        />
        <div className="container park__container">
          <Card
            single={true}
            owner={this.props.profile.user._id === this.props.park.form.ownerId}
            park={this.props.park.form}
            history={this.props.history}
            appState={this.props.appState}
            deletePark={this.props.api.deletePark}
            token={this.props.appState.authToken}
            setModalError={this.props.actions.setModalError}
            vote={this.props.api.vote}
            voted={this.props.park.voted}
          />
        </div>
      </div>
    );
  }
}

ViewPark.propTypes = {
  appState: PropTypes.shape({
    loggedIn: PropTypes.bool,
    user: PropTypes.shape({
      _id: PropTypes.string
    }),
    authToken: PropTypes.string
  }).isRequired,
  actions: PropTypes.shape({
    setLoggedIn: PropTypes.func,
    dismissModal: PropTypes.func
  }).isRequired,
  api: PropTypes.shape({
    viewPark: PropTypes.func,
    deletePark: PropTypes.func,
    vote: PropTypes.func
  }).isRequired,
  profile: PropTypes.shape({
    user: PropTypes.shape({
      _id: PropTypes.string
    })
  }).isRequired,
  park: PropTypes.shape({
    form: PropTypes.shape({
      question: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.string,
          _id: PropTypes.string
        })
      ).isRequired,
      ownerId: PropTypes.string,
      _id: PropTypes.string
    }).isRequired,
    errorMsg: PropTypes.string,
    spinnerClass: PropTypes.string,
    modal: PropTypes.shape({
      class: PropTypes.string,
      text: PropTypes.string,
      title: PropTypes.string
    })
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
};

const mapStateToProps = state => ({
  appState: state.appState,
  park: state.park,
  profile: state.profile
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch)
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ViewPark)
);
