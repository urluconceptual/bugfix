import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA0bosnMqpmo-D_N1VClZNNt0pWjvk6-iM",
  authDomain: "bugfix-446ad.firebaseapp.com",
  projectId: "bugfix-446ad",
  storageBucket: "bugfix-446ad.appspot.com",
  messagingSenderId: "815045008506",
  appId: "1:815045008506:web:e3856cc9c17b375cf32fc3"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
