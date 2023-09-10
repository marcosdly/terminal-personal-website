import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEz5fL4ishtXU1reKeB4s_sbMIsor4hHY",
  authDomain: "marcosdly-personal-website.firebaseapp.com",
  projectId: "marcosdly-personal-website",
  storageBucket: "marcosdly-personal-website.appspot.com",
  messagingSenderId: "153802579721",
  appId: "1:153802579721:web:af16c3f7df90b944847dd8",
  measurementId: "G-XRJG498H3L",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const mainBucket = getStorage(app, "gs://marcosdly-personal-website.appspot.com");
