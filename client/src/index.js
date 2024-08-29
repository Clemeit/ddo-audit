import "bootstrap/dist/css/bootstrap.css";

import React, { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import browserRouter from "./browserRouter";
import "../src/default.css";

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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Suspense fallback={<div></div>}>
      <RouterProvider router={browserRouter} />
    </Suspense>
  </React.StrictMode>
);

// Register the service worker
serviceWorkerRegistration.register();
