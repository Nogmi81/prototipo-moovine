import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  fetchSignInMethodsForEmail,
} from "firebase/auth";

import { useState } from "react";
import { auth } from "../firebase/config";

export const useAuthentication = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const clearAuthError = () => setError(null);
  const startLoading = () => {
    setLoading(true);
    setError(null);
  };
  const stopLoading = () => setLoading(false);

  const register = async ({ email, password, displayName }) => {
    startLoading();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: displayName.trim() });
      await sendEmailVerification(user);
      return user;
    } catch (err) {
      const errorMap = {
        "auth/email-already-in-use": "Este e-mail já está em uso.",
        "auth/weak-password": "A senha deve ter pelo menos 6 caracteres.",
        "auth/invalid-email": "O formato do e-mail é inválido.",
      };
      setError(errorMap[err.code] || "Ocorreu um erro no cadastro.");
    } finally {
      stopLoading();
    }
  };

  const loginWithEmail = async ({ email, password }) => {
    startLoading();
    try {
      const normalizedEmail = email.trim().toLowerCase();

      // Verifica os métodos de login associados ao e-mail
      const signInMethods = await fetchSignInMethodsForEmail(auth, normalizedEmail);

      if (signInMethods.length === 0) {
        setError("Este e-mail não está cadastrado.");
        return null;
      }

      if (signInMethods.includes("google.com") && !signInMethods.includes("password")) {
        setError("Este e-mail está vinculado ao Google. Use 'Entrar com Google'.");
        return null;
      }

      // Login normal com e-mail e senha
      const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError("Seu e-mail ainda não foi verificado. Verifique sua caixa de entrada.");
        await signOut(auth);
        return null;
      }

      return user;
    } catch (err) {
      const errorMap = {
        "auth/wrong-password": "E-mail ou senha incorretos.",
        "auth/invalid-email": "Formato de e-mail inválido.",
        "auth/invalid-credential": "E-mail ou senha incorretos.",
      };
      setError(errorMap[err.code] || `Erro ao fazer login: ${err.message}`);
      return null;
    } finally {
      stopLoading();
    }
  };

  const loginWithGoogle = async () => {
    startLoading();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (err) {
      const errorMap = {
        "auth/popup-closed-by-user": "Login com Google cancelado.",
        "auth/popup-blocked": "O pop-up foi bloqueado. Permita pop-ups para este site.",
        "auth/cancelled-popup-request": "A requisição do pop-up foi cancelada.",
        "auth/operation-not-allowed": "Login com Google não está habilitado no Firebase.",
        "auth/credential-already-in-use": "Este e-mail já está associado a outra conta. Use outro método.",
      };
      setError(errorMap[err.code] || `Erro: ${err.message}`);
      return null;
    } finally {
      stopLoading();
    }
  };

  const logout = async () => {
    startLoading();
    try {
      await signOut(auth);
    } catch {
      setError("Erro ao fazer logout.");
    } finally {
      stopLoading();
    }
  };

  return {
    register,
    loginWithEmail,
    loginWithGoogle,
    logout,
    error,
    loading,
    clearAuthError,
  };
};
