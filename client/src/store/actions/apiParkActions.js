import { RSAA } from "redux-api-middleware";
import { BASE_URL } from "./apiConfig.js";

export const GET_GUESTLIST_REQUEST = "GET_GUESTLIST_REQUEST";
export const GET_GUESTLIST_SUCCESS = "GET_GUESTLIST_SUCCESS";
export const GET_GUESTLIST_FAILURE = "GET_GUESTLIST_FAILURE";
export const VIEW_PARK_REQUEST = "VIEW_PARK_REQUEST";
export const VIEW_PARK_SUCCESS = "VIEW_PARK_SUCCESS";
export const VIEW_PARK_FAILURE = "VIEW_PARK_FAILURE";
export const GET_ALL_PARKS_REQUEST = "GET_ALL_PARKS_REQUEST";
export const GET_ALL_PARKS_SUCCESS = "GET_ALL_PARKS_SUCCESS";
export const GET_ALL_PARKS_FAILURE = "GET_ALL_PARKS_FAILURE";
export const GET_USER_PARKS_REQUEST = "GET_USER_PARKS_REQUEST";
export const GET_USER_PARKS_SUCCESS = "GET_USER_PARKS_SUCCESS";
export const GET_USER_PARKS_FAILURE = "GET_USER_PARKS_FAILURE";
export const CHECKIN_REQUEST = "CHECKIN_REQUEST";
export const CHECKIN_SUCCESS = "CHECKIN_SUCCESS";
export const CHECKIN_FAILURE = "CHECKIN_FAILURE";

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
* Function: getAllParks - return all parks in specified city from Yelp API
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
export function getAllParks(city) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/park/allparks/${city}`,
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
* Function: checkIn - check in the logged in user to a park (or check out)
* @param {string} token
* This action dispatches additional actions as it executes:
*   CHECKIN_REQUEST:
*     Initiates a spinner on the home page.
*   CHECKIN_SUCCESS:
*     If vote succesfully recorded, hides spinner
*   CHECKIN_FAILURE:
*     If database error,
*     Hides spinner, displays error message in modal
*/
export function checkIn(parkId, userId) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/park/checkin/${parkId}/${userId}`,
      method: "PUT",
      types: [
        CHECKIN_REQUEST,
        CHECKIN_SUCCESS,
        {
          type: CHECKIN_FAILURE,
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
      }
    }
  };
}

/*
* Function: getGuestList - get the guest list of a specific park by Yelp ID
* @param {string} token
* This action dispatches additional actions as it executes:
*   GET_GUESTLIST_REQUEST:
*     Initiates a spinner on the home page.
*   GET_GUESTLIST_SUCCESS:
*     If vote succesfully recorded, hides spinner
*   GET_GUESTLIST_FAILURE:
*     If database error,
*     Hides spinner, displays error message in modal
*/
export function getGuestlist(parkId) {
  return {
    [RSAA]: {
      endpoint: `${BASE_URL}/api/park/guestlist/${parkId}`,
      method: "GET",
      types: [
        GET_GUESTLIST_REQUEST,
        GET_GUESTLIST_SUCCESS,
        {
          type: GET_GUESTLIST_FAILURE,
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
      }
    }
  };
}
