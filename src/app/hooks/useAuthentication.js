import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

import { useState } from "react";
import { auth } from "../firebase/config";

export const useAuthentication = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const register = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      setError('E-mail não encontrado' + ' ('+ err.message +')');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (err) {
      setError(err.message + 'Gmail não encontrado');
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loginWithEmail,
    loginWithGoogle,
    error,
    loading
  };
};
