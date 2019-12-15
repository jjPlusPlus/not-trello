import * as firebase from "firebase";

// import app from "firebase/app";

import "firebase/auth";
import "firebase/database";

const config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

firebase.initializeApp(config);

export default firebase;

export const database = firebase.database().ref();
