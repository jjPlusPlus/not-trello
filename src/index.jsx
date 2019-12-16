import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import { Provider } from "react-redux";

import { ReactReduxFirebaseProvider } from "react-redux-firebase";

import "./App.scss";
import "./styles/tailwind.css";

import firebase from "./components/firebase";

import configureStore from "./store";

const store = configureStore();

const reactReduxFirebaseConfig = { userProfile: "users" };
const reactReduxFirebaseProps = {
  firebase,
  config: reactReduxFirebaseConfig,
  dispatch: store.dispatch,
};

ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...reactReduxFirebaseProps}>
      <App />
    </ReactReduxFirebaseProvider>
  </Provider>
  , document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
