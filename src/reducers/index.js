import { combineReducers } from "redux";

import appReducer from "./app";

import { firebaseReducer } from "react-redux-firebase";

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  local: appReducer,
});

export default rootReducer;
