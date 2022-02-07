importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
    "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

firebase.initializeApp({
    apiKey: "AIzaSyDdyzwPB6QilPc8TjbXur5PFWoDhUwMqgA",
    authDomain: "ddo-audit.firebaseapp.com",
    projectId: "ddo-audit",
    storageBucket: "ddo-audit.appspot.com",
    messagingSenderId: "991134126408",
    appId: "1:991134126408:web:d06c24e266191b7c9ea37d",
    measurementId: "G-YG3R94WB3B",
});

const messaging = isSupported() ? getMessaging() : null;
