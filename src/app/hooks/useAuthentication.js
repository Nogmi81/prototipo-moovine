import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
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
      
      const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      const user = userCredential.user;

      // consultar se o e-mail foi verificado
      if (!user.emailVerified) {
        setError("Seu e-mail ainda não foi verificado. Por favor, verifique sua caixa de entrada e clique no link de verificação.");
        await signOut(auth); // Desloga o usuário se o e-mail não foi verificado
        return null;
      }

      return user;
    } catch (err) {
      const errorMap = {
        "auth/wrong-password": "E-mail ou senha incorretos.",
        "auth/user-not-found": "E-mail ou senha incorretos.",
        "auth/invalid-credential": "E-mail ou senha incorretos. Se você se cadastrou com Google clique em 'Entrar com Google'",
        "auth/invalid-email": "Formato de e-mail inválido.",
        "auth/account-exists-with-different-credential":
          "Este e-mail já está cadastrado com outro método (ex: Google). Por favor, use a opção 'Entrar com Google' ou redefina sua senha.",
      };
      setError(errorMap[err.code] || `Erro ao fazer login: ${err.message}`);
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
        "auth/popup-blocked": "O pop-up de login foi bloqueado pelo navegador. Por favor, permita pop-ups para este site.",
        "auth/cancelled-popup-request": "A requisição do pop-up foi cancelada.",
        "auth/operation-not-allowed": "O método de login com Google não está habilitado no Firebase.",
        "auth/credential-already-in-use": "Este e-mail Google já está associado a uma conta existente. Faça login com e-mail e senha.",
      };
      setError(errorMap[err.code] || `Erro: ${err.message}`);
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
