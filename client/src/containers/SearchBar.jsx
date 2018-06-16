import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiParkActions";
import * as apiActions2 from "../store/actions/apiActions";
import { fieldValidations, run } from "../utils/";

import Form from "./Form";

const fields = [
  {
    name: "city",
    label: "city",
    autoComplete: "city",
    type: "text",
    placeholder: "Portland, OR"
  }
];

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.search = this.search.bind(this);
  }

  componentDidMount() {
    if (this.props.profile.user.savedSearch !== "") {
      const setSavedCity = async () =>
        this.props.actions.setFormField(
          "city",
          this.props.profile.user.savedSearch
        );
      setSavedCity().then(() => {
        this.search();
      });
    }
  }

  search() {
    const { city } = this.props.park.form;

    // show validation errors
    this.props.actions.showFormError();
    this.props.actions.setSubmit();
    this.props.actions.setTouched("city");
    this.props.actions.setShowError("city", true);

    const validationErrors = run(this.props.park.form, fieldValidations.search);

    const setValidationErrors = async () =>
      this.props.actions.setValidationErrors(validationErrors);

    setValidationErrors().then(() => {
      if (!this.props.park.form.validationErrors.city) {
        this.props.api
          .getAllParks(city)
          .then(result => {
            if (result.type === "GET_ALL_PARKS_FAILURE") {
              this.props.actions.showFormError();
              this.props.actions.setSubmit();
            }
            if (result.type === "GET_ALL_PARKS_SUCCESS") {
              // update lastSearched  on user object if user is logged in
              if (this.props.appState.loggedIn && city !== "") {
                const { authToken } = this.props.appState;
                const { _id } = this.props.profile.user;
                const body = Object.assign(
                  { ...this.props.profile.user },
                  { savedSearch: city }
                );
                this.props.api2
                  .modifyProfile(authToken, _id, body)
                  .then(result => {})
                  .catch(err => {
                    let error;
                    typeof err.message === "string"
                      ? (error = err.message)
                      : (error = undefined);
                    console.log(error);
                  });
              }
            }
          })
          .catch(err => {
            let error;
            typeof err.message === "string"
              ? (error = err.message)
              : (error = undefined);
            console.log(error);
            this.props.actions.setFormError(error);
            this.props.actions.setFormField({
              error: err
            });
            // show validation errors
            this.props.actions.showFormError();
            this.props.actions.setSubmit();
          });
      } else {
        this.props.actions.setFormError("Please enter your location");
      }
    });
  }

  render() {
    return (
      <Form
        fields={fields}
        form="search"
        reducer="park"
        buttonText="Search"
        formAction={this.search}
        className="search"
      />
    );
  }
}

SearchBar.propTypes = {
  park: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    image_url: PropTypes.string
  }).isRequired,
  appState: PropTypes.shape({
    loggedIn: PropTypes.bool
  }).isRequired,
  profile: PropTypes.shape({
    user: PropTypes.shape({
      savedSearch: PropTypes.string
    })
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
};

const mapStateToProps = state => ({
  park: state.park,
  appState: state.appState,
  profile: state.profile
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch),
  api2: bindActionCreators(apiActions2, dispatch)
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SearchBar)
);
