'use client';

import { onAuthStateChanged } from "firebase/auth";

// context
// import { AuthProvider } from "./contexts/AuthContext";

import Main from './components/Main';

export default function HomePage() {
  
  return (
    <div> 
      <Main />
    </div>
  );
}