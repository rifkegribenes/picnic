import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";
import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiParkActions";

import Spinner from "./Spinner";
import ModalSm from "./ModalSm";
import CardMini from "./CardMini";

class Parks extends React.Component {
  componentWillMount() {}

  render() {
    const parks = this.props.park.parks.map((park, idx) => {
      return (
        <CardMini key={park._id} park={park} history={this.props.history} />
      );
    });
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
          dismiss={() => {
            this.props.actions.dismissModal();
            if (this.props.park.modal.type === "modal__error") {
              this.props.history.push("/login");
            }
          }}
          redirect={this.props.park.modal.redirect}
          action={() => {
            if (this.props.park.modal.action) {
              this.props.park.modal.action();
            } else {
              this.props.actions.dismissModal();
              if (this.props.park.modal.type === "modal__error") {
                this.props.history.push("/login");
              }
            }
          }}
        />
        <div className="parks-grid">{parks}</div>
      </div>
    );
  }
}

Parks.propTypes = {
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
    deletePark: PropTypes.func
  }).isRequired,
  park: PropTypes.shape({
    form: PropTypes.shape({
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Parks));
