import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCR-odZ-MqFfdNNNhfKUvnUQP2M7qPZj30",
  authDomain: "e-commerce-48c63.firebaseapp.com",
  projectId: "e-commerce-48c63",
  storageBucket: "e-commerce-48c63.appspot.com",
  messagingSenderId: "998734048325",
  appId: "1:998734048325:web:d4ae400b92a7c6b965072c",
  measurementId: "G-WM5QPFMM2G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set persistence to LOCAL to persist the user's authentication state
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Firebase persistence error:", error);
  });

// Configure Google provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
});

export { auth, provider }; 