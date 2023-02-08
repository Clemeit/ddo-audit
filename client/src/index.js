import "bootstrap/dist/css/bootstrap.css";

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdyzwPB6QilPc8TjbXur5PFWoDhUwMqgA",
  authDomain: "ddo-audit.firebaseapp.com",
  projectId: "ddo-audit",
  storageBucket: "ddo-audit.appspot.com",
  messagingSenderId: "991134126408",
  appId: "1:991134126408:web:d06c24e266191b7c9ea37d",
  measurementId: "G-YG3R94WB3B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Firebase messaging object
const messaging =
  isSupported() && navigator.serviceWorker != null ? getMessaging() : null;

if (messaging != null) {
  onMessage(messaging, (payload) => {
    //console.log("Message received. ", payload);
    // ...
  });
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
