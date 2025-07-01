// firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCeCD_X_Y2g2kdsSuDkTp0jPoRYhy0fqcU",
  authDomain: "bd-moovine.firebaseapp.com",
  projectId: "bd-moovine",
  storageBucket: "bd-moovine.firebasestorage.app",
  messagingSenderId: "992136406172",
  appId: "1:992136406172:web:2c4102a96ccc94c168f959",
  measurementId: "G-FF5SGBEQZG",
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);

/// Exportar o auth para usar no hook
export const auth = getAuth(app);
export const db = getFirestore(app);
