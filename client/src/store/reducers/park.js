import update from "immutability-helper";

import {
  SET_FORM_FIELD,
  SET_FORM_ERROR,
  SHOW_FORM_ERROR,
  RESET_FORM,
  DISMISS_MODAL,
  SET_MODAL_ERROR,
  SET_SPINNER,
  SET_TOUCHED,
  SET_VALIDATION_ERRORS,
  SET_SHOW_ERROR
} from "../actions";
import {
  VIEW_PARK_REQUEST,
  VIEW_PARK_SUCCESS,
  VIEW_PARK_FAILURE,
  GET_ALL_PARKS_REQUEST,
  GET_ALL_PARKS_SUCCESS,
  GET_ALL_PARKS_FAILURE,
  GET_USER_PARKS_REQUEST,
  GET_USER_PARKS_SUCCESS,
  GET_USER_PARKS_FAILURE,
  CHECKIN_REQUEST,
  CHECKIN_SUCCESS,
  CHECKIN_FAILURE,
  GET_GUESTLIST_REQUEST,
  GET_GUESTLIST_SUCCESS,
  GET_GUESTLIST_FAILURE
} from "../actions/apiParkActions";
import {
  RESEND_VLINK_REQUEST,
  RESEND_VLINK_SUCCESS,
  RESEND_VLINK_FAILURE,
  GET_PARTIAL_PROFILE_REQUEST,
  GET_PARTIAL_PROFILE_SUCCESS,
  GET_PARTIAL_PROFILE_FAILURE
} from "../actions/apiActions";

const INITIAL_STATE = {
  errorMsg: "",
  spinnerClass: "spinner__hide",
  modal: {
    class: "modal__hide",
    type: "",
    title: "",
    text: ""
  },
  form: {
    city: "",
    showFieldErrors: {
      city: false
    },
    validationErrors: {},
    touched: {},
    error: ""
  },
  parks: [],
  currentPark: {
    parkId: "",
    guestList: []
  },
  showFormError: false
};

function park(state = INITIAL_STATE, action) {
  let error;
  let title;
  switch (action.type) {
    /*
    * Called from: <Form />, <ModalSm />, <CreatePark />
    * Payload: Form field Name and Value
    * Purpose: Update the connected form field.
    */
    case SET_FORM_FIELD:
      return update(state, {
        form: { [action.payload.id]: { $set: action.payload.value } }
      });

    /*
    *  Called From: <Login />, <Register />, <ResetPassword />
    *  Payload: Text - error message
    *  Purpose: Show error message on form
    */
    case SET_FORM_ERROR:
      if (typeof action.payload === "string") {
        error = action.payload;
      } else if (typeof action.payload.message === "string") {
        error = action.payload.message;
      } else if (action.payload.message === null) {
        error = null;
      } else {
        error = "Sorry, something went wrong :( \n Please try again.";
      }

      return Object.assign({}, state, { errorMsg: error });

    case SHOW_FORM_ERROR:
      return update(state, {
        showFormError: { $set: action.payload },
        form: {
          error: { $set: action.payload }
        }
      });

    /*
    *  Called From: <ParkOptions />, <Form />
    *  Payload: Field Name
    *  Purpose: Set field "touched" for validation error display logic
    */
    case SET_TOUCHED:
      return update(state, {
        form: {
          touched: {
            [action.payload]: { $set: true }
          }
        }
      });

    /*
    *  Called From: <ParkOptions />
    *  Payload: Field Name
    *  Purpose: Set field "touched" for validation error display logic
    */
    case SET_SHOW_ERROR:
      return update(state, {
        form: {
          showFieldErrors: {
            [action.payload.name]: { $set: action.payload.bool }
          }
        }
      });

    /*
    *  Called From: <ParkOptions />
    *  Payload: Validation errors object
    *  Purpose: Set validation errors object
    */
    case SET_VALIDATION_ERRORS:
      return update(state, {
        form: {
          validationErrors: { $set: { ...action.payload } }
        }
      });

    /*
    *  Called From: <Login />, <Register />, <ResetPassword />, <CreatePark />
    *  Payload: none
    *  Purpose: Reset Form
    */
    case RESET_FORM:
      return INITIAL_STATE;

    /*
    *  Called From: <CreatePark />, <ViewPark />, <AllParks />, <UserParks />
    *  Payload: None
    *  Purpose: Activate spinner to indicates API request is in progress
    */
    case GET_PARTIAL_PROFILE_REQUEST:
    case GET_USER_PARKS_REQUEST:
    case GET_ALL_PARKS_REQUEST:
    case RESEND_VLINK_REQUEST:
    case VIEW_PARK_REQUEST:
    case CHECKIN_REQUEST:
    case GET_GUESTLIST_REQUEST:
      return Object.assign({}, state, {
        spinnerClass: "spinner__show",
        modal: {
          class: "modal__hide",
          text: ""
        },
        errorMsg: ""
      });

    /*
    * Toggle spinner class (for social auth done with href
    * rather than API call)
    */
    case SET_SPINNER:
      return Object.assign({}, state, {
        spinnerClass: `spinner__${action.payload}`
      });

    /*
    *  Called From: <CreatePark />
    *  Payload: Error Message
    *  Purpose: Hide spinner,
    *  Display error message in modal. Generic, called from various components
    */
    case SET_MODAL_ERROR:
      if (typeof action.payload.message === "string") {
        error = action.payload.message;
      } else {
        error = "Sorry, something went wrong :(\nPlease try again.";
      }
      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        modal: {
          class: { $set: "modal__show" },
          text: { $set: error },
          title: { $set: action.payload.title },
          type: { $set: "modal__error" },
          buttonText: { $set: action.payload.buttonText },
          action: { $set: action.payload.action },
          modalDanger: { $set: action.payload.modalDanger }
        }
      });

    /*
    *  Called from: <Login />
    *  Payload: None
    *  Purpose: update state to dismiss the modal box
    */
    case DISMISS_MODAL:
      return Object.assign({}, state, {
        modal: {
          text: "",
          class: "modal__hide",
          type: "",
          title: ""
        }
      });

    /*
    *  Called from: <UserParks />
    *  Payload: partial user object (name and avatar only)
    *  Purpose: Display name and avatar of park owner
    */
    case GET_PARTIAL_PROFILE_SUCCESS:
      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        modal: {
          class: { $set: "modal__hide" }
        },
        form: {
          ownerName: { $set: action.payload.firstName },
          ownerAvatar: { $set: action.payload.avatarUrl },
          ownerId: { $set: action.payload.ownerId }
        }
      });

    /*
    *  Called from: <CardMini />
    *  Payload: guestList array
    *  Purpose: save mongo guestlist to currentPark
    */
    case CHECKIN_SUCCESS:
    case GET_GUESTLIST_SUCCESS:
      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        modal: {
          class: { $set: "modal__hide" }
        },
        currentPark: {
          id: { $set: action.payload.parkId },
          guestList: { $set: action.payload.guestList }
        }
      });

    case VIEW_PARK_SUCCESS:
      // is this even being used ???
      console.log("view park");

      return update(state, {
        spinnerClass: { $set: "spinner__hide" },
        modal: {
          class: { $set: "modal__hide" }
        }
      });

    /*
    *  Called from: <AllParks />, <UserParks />
    *  Payload: array of park objects
    *  Purpose: Display parks
    */
    case GET_ALL_PARKS_SUCCESS:
    case GET_USER_PARKS_SUCCESS:
      return Object.assign({}, state, {
        spinnerClass: "spinner__hide",
        modal: {
          class: "modal__hide"
        },
        parks: [...action.payload]
      });

    /*
    *  Called from: <CreatePark />, <ViewPark />, <AllParks />, <UserParks />
    *  Payload: Error message
    *  Purpose: Display error message
    */
    case GET_PARTIAL_PROFILE_FAILURE:
    case GET_USER_PARKS_FAILURE:
    case GET_ALL_PARKS_FAILURE:
    case VIEW_PARK_FAILURE:
    case GET_GUESTLIST_FAILURE:
      if (action.type === GET_ALL_PARKS_FAILURE) {
        console.log(action.payload);
      }
      if (typeof action.payload.message === "string") {
        error = action.payload.message;
      } else {
        error = "Sorry, something went wrong :(\nPlease try again.";
      }
      return Object.assign({}, state, {
        spinnerClass: "spinner__hide",
        modal: {
          class: "modal__show",
          type: "modal__error",
          text: error,
          title,
          buttonText: "Try again"
        }
      });

    case CHECKIN_FAILURE:
      if (typeof action.payload.message === "string") {
        error = action.payload.message;
      } else {
        error = "Sorry, something went wrong :(\nPlease try again.";
      }
      return Object.assign({}, state, {
        spinnerClass: "spinner__hide",
        modal: {
          class: "modal__show",
          type: "modal__error",
          text: error,
          title,
          buttonText: "Try again"
        }
      });

    /*
    *  Called From: <CreatePark />
    *  Payload: N/A
    *  Purpose: Hide spinner, show success modal about email verification.
    */
    case RESEND_VLINK_SUCCESS:
      return Object.assign({}, state, {
        spinnerClass: "spinner__hide",
        modal: {
          class: "modal__show",
          text:
            "Please check your email for a message, and click the link to verify your email address.",
          title: "Verification Link Sent",
          type: "modal__success",
          redirect: "/"
        }
      });

    /*
    *  Called from: <CreatePark />
    *  Payload: Error message
    *  Purpose: Display an error message to the user.
    */
    case RESEND_VLINK_FAILURE:
      if (typeof action.payload.message === "string") {
        error = action.payload.message;
      } else {
        error = "Sorry, something went wrong :(\nPlease try again.";
      }
      return Object.assign({}, state, {
        spinnerClass: "spinner__hide",
        modal: {
          class: "modal__show",
          type: "modal__error",
          text: error,
          title: "Failure: Message not sent",
          buttonText: "Try again"
        }
      });

    default:
      return state;
  }
}

export default park;
