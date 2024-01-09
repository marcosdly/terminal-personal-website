"use strict";

import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyBEz5fL4ishtXU1reKeB4s_sbMIsor4hHY",
  authDomain: "marcosdly-personal-website.firebaseapp.com",
  projectId: "marcosdly-personal-website",
  storageBucket: "marcosdly-personal-website.appspot.com",
  messagingSenderId: "153802579721",
  appId: "1:153802579721:web:af16c3f7df90b944847dd8",
  measurementId: "G-XRJG498H3L",
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
