import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import PropTypes from "prop-types";

import * as Actions from "../store/actions";
import * as apiActions from "../store/actions/apiParkActions";

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
    this.props.api.getAllParks(city).then(result => {
      if (result.type === "GET_ALL_PARKS_SUCCESS") {
        // this.props.actions.setLoggedIn();
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
