import { combineReducers } from "redux";
import appState from "../reducers/appState";
import auth from "../reducers/auth";
import profile from "../reducers/profile";
import park from "../reducers/park";

const rootReducer = combineReducers({
  appState,
  auth,
  profile,
  park
});

export default rootReducer;
