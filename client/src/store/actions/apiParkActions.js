import { RSAA } from "redux-api-middleware";
import { BASE_URL } from "./apiConfig.js";

export const CREATE_PARK_REQUEST = "CREATE_PARK_REQUEST";
export const CREATE_PARK_SUCCESS = "CREATE_PARK_SUCCESS";
export const CREATE_PARK_FAILURE = "CREATE_PARK_FAILURE";
export const UPDATE_PARK_REQUEST = "UPDATE_PARK_REQUEST";
export const UPDATE_PARK_SUCCESS = "UPDATE_PARK_SUCCESS";
export const UPDATE_PARK_FAILURE = "UPDATE_PARK_FAILURE";
export const DELETE_PARK_REQUEST = "DELETE_PARK_REQUEST";
export const DELETE_PARK_SUCCESS = "DELETE_PARK_SUCCESS";
export const DELETE_PARK_FAILURE = "DELETE_PARK_FAILURE";
export const VIEW_PARK_REQUEST = "VIEW_PARK_REQUEST";
export const VIEW_PARK_SUCCESS = "VIEW_PARK_SUCCESS";
export const VIEW_PARK_FAILURE = "VIEW_PARK_FAILURE";
export const GET_ALL_PARKS_REQUEST = "GET_ALL_PARKS_REQUEST";
export const GET_ALL_PARKS_SUCCESS = "GET_ALL_PARKS_SUCCESS";
export const GET_ALL_PARKS_FAILURE = "GET_ALL_PARKS_FAILURE";
export const GET_USER_PARKS_REQUEST = "GET_USER_PARKS_REQUEST";
export const GET_USER_PARKS_SUCCESS = "GET_USER_PARKS_SUCCESS";
export const GET_USER_PARKS_FAILURE = "GET_USER_PARKS_FAILURE";
export const VOTE_REQUEST = "VOTE_REQUEST";
export const VOTE_SUCCESS = "VOTE_SUCCESS";
export const VOTE_FAILURE = "VOTE_FAILURE";

/*
* Function: createPark - create a new park
* @param {string} body - park title, question and options; userId & token
* This action dispatches additional actions as it executes:
*   CREATE_PARK_REQUEST:
*     Initiates a spinner on the home page.
*   CREATE_PARK_SUCCESS:
*     If new park successfully saved to database, Hides spinner,
*     displays success message in modal
*   CREATE_PARK_FAILURE:
*     If park name already exists or form validation fails,
*     Hides spinner, displays error message in modal
*/
export function createPark(token, body) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/park/createpark`,
      method: "POST",
      types: [
        CREATE_PARK_REQUEST,
        CREATE_PARK_SUCCESS,
        {
          type: CREATE_PARK_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ],
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  };
}

/*
* Function: updatePark - find and update existing park
* @param {string} body - park id, title, question and options; userId & token
* This action dispatches additional actions as it executes:
*   UPDATE_PARK_REQUEST:
*     Initiates a spinner on the home page.
*   UPDATE_PARK_SUCCESS:
*     If park successfully saved to database, Hides spinner,
*     displays success message in modal
*   UPDATE_PARK_FAILURE:
*     If park update fails,
*     Hides spinner, displays error message in modal
*/
export function updatePark(token, body) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/park/update/${body._id}`,
      method: "PUT",
      types: [
        UPDATE_PARK_REQUEST,
        UPDATE_PARK_SUCCESS,
        {
          type: UPDATE_PARK_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ],
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  };
}

/*
* Function: viewPark - get a single park by ID
* @param {string} parkId
* This action dispatches additional actions as it executes:
*   VIEW_PARK_REQUEST:
*     Initiates a spinner on the home page.
*   VIEW_PARK_SUCCESS:
*     If new park successfully retrieved, hides spinner
*   VIEW_PARK_FAILURE:
*     If database error,
*     Hides spinner, displays error message in modal
*/
export function viewPark(parkId) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/park/${parkId}`,
      method: "GET",
      types: [
        VIEW_PARK_REQUEST,
        VIEW_PARK_SUCCESS,
        {
          type: VIEW_PARK_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ]
    }
  };
}

/*
* Function: deletePark - delete a single park by ID
* @param {string} token, parkId
* This action dispatches additional actions as it executes:
*   DELETE_PARK_REQUEST:
*     Initiates a spinner on the home page.
*   DELETE_PARK_SUCCESS:
*     If park successfully deleted, hides spinner
*   DELETE_PARK_FAILURE:
*     If database error,
*     Hides spinner, displays error message in modal
*/
export function deletePark(token, parkId) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/park/delete/${parkId}`,
      method: "DELETE",
      types: [
        DELETE_PARK_REQUEST,
        DELETE_PARK_SUCCESS,
        {
          type: DELETE_PARK_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ],
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  };
}

/*
* Function: getAllParks - return all active parks in database
* @param {string} token
* This action dispatches additional actions as it executes:
*   GET_ALL_PARKS_REQUEST:
*     Initiates a spinner on the home page.
*   GET_ALL_PARKS_SUCCESS:
*     If parks array successfully retrieved, hides spinner
*   GET_ALL_PARKS_FAILURE:
*     If database error,
*     Hides spinner, displays error message in modal
*/
export function getAllParks() {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/park/allparks`,
      method: "GET",
      types: [
        GET_ALL_PARKS_REQUEST,
        GET_ALL_PARKS_SUCCESS,
        {
          type: GET_ALL_PARKS_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ]
    }
  };
}

/*
* Function: getUserParks - return all parks for specific user
* @param {string} token
* This action dispatches additional actions as it executes:
*   GET_USER_PARKS_REQUEST:
*     Initiates a spinner on the home page.
*   GET_USER_PARKS_SUCCESS:
*     If parks array successfully retrieved, hides spinner
*   GET_USER_PARKS_FAILURE:
*     If database error,
*     Hides spinner, displays error message in modal
*/
export function getUserParks(userId) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/park/userparks/${userId}`,
      method: "GET",
      types: [
        GET_USER_PARKS_REQUEST,
        GET_USER_PARKS_SUCCESS,
        {
          type: GET_USER_PARKS_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ]
    }
  };
}

/*
* Function: vote - vote for an option in a park
* @param {string} token
* This action dispatches additional actions as it executes:
*   VOTE_REQUEST:
*     Initiates a spinner on the home page.
*   VOTE_SUCCESS:
*     If vote succesfully recorded, hides spinner
*   VOTE_FAILURE:
*     If database error,
*     Hides spinner, displays error message in modal
*/
export function vote(parkId, optionId, body) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/park/vote/${parkId}/${optionId}`,
      method: "POST",
      types: [
        VOTE_REQUEST,
        VOTE_SUCCESS,
        {
          type: VOTE_FAILURE,
          payload: (action, state, res) => {
            return res.json().then(data => {
              let message = "Sorry, something went wrong :(";
              if (data) {
                if (data.message) {
                  message = data.message;
                }
                return { message };
              } else {
                return { message };
              }
            });
          }
        }
      ],
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  };
}
