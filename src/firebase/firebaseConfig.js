import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDPmrvLLCfKr-8b2WY_JTgxRmOBshVWDIo",
  authDomain: "producto1-5b4a3.firebaseapp.com",
  projectId: "producto1-5b4a3",
  storageBucket: "producto1-5b4a3.appspot.com",
  messagingSenderId: "199796903622",
  appId: "1:199796903622:web:a6f9ce1382e57b976a51c7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;