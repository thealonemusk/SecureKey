import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId } from './constants.js';


// Initialize Firebase
// const firebaseConfig = {
//   apiKey: {apiKey},
//   authDomain: {authDomain},
//   projectId: {projectId},
//   storageBucket:{storageBucket},
//   messagingSenderId: {messagingSenderId},
//   appId: {appId},
//   measurementId: {measurementId},
// };

const firebaseConfig = {
    apiKey: "AIzaSyABdeQblaoybKfXUl89QnDRAaaOA5amD6s",
    authDomain: "pass-manager-132ff.firebaseapp.com",
    projectId: "pass-manager-132ff",
    storageBucket: "pass-manager-132ff.appspot.com",
    messagingSenderId: "67812387980",
    appId: "1:67812387980:web:70bfd393dc597786f59fa9",
    measurementId: "G-23YCNGWW6H"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service

const auth = getAuth();

export { auth };
