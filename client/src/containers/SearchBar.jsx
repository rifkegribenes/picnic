import React from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import Form from "./Form";

const fields = [
  {
    name: "city",
    label: "city",
    autoComplete: "locality",
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
      console.log(result);
      if (result.type === "GET_ALL_PARKS_SUCCESS") {
        // this.props.actions.setLoggedIn();
      }
    });
  }

  render() {
    return (
      <Form
        fields={fields}
        reducer="park"
        buttonText="Search"
        formAction={this.search}
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

export default withRouter(SearchBar);
