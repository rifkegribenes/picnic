import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiParkActions";
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

  search() {
    const { city } = this.props.park.form;
    console.log(city);
    // show validation errors
    this.props.actions.showFormError();
    this.props.actions.setSubmit();
    this.props.actions.setTouched("city");
    this.props.actions.setShowError("city", true);

    const validationErrors = run(this.props.park.form, fieldValidations.search);

    this.props.actions.setValidationErrors(validationErrors);
    // workaround for race condition
    // redux is not updating validation errors in time for next function call
    setTimeout(() => {
      if (!this.props.park.form.validationErrors.city) {
        this.props.api
          .getAllParks(city)
          .then(result => {
            if (result.type === "GET_ALL_PARKS_FAILURE") {
              console.log("get parks failure");
              this.props.actions.showFormError();
              this.props.actions.setSubmit();
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
    }, 200);
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
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
};

const mapStateToProps = state => ({
  park: state.park
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
  api: bindActionCreators(apiActions, dispatch)
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SearchBar)
);
