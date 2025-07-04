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

 const register = async ({ email, password, displayName }) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Cria o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Salva o displayName no Firebase Authentication
      await updateProfile(user, { displayName: displayName });
      // console.log("DisplayName salvo no Authentication:", displayName);

      // 3. Envia o e-mail de verificação
      await sendEmailVerification(user);
      // console.log("E-mail de verificação enviado para:", user.email);

      // Não salva no Firestore neste momento, como solicitado.

      return user; // Retorna o usuário criado/atualizado
    } catch (err) {
      // console.error("Erro no cadastro:", err.message);
      let errorMessage = "Ocorreu um erro no cadastro.";
      if (err.code === "auth/email-already-in-use") {
        errorMessage = "Este e-mail já está em uso.";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "A senha deve ter pelo menos 6 caracteres.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "O formato do e-mail é inválido.";
      }
      setError(errorMessage);
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
      setError('E-mail ou senha incorretos. (' + err.message + ')');
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
      // Para login com Google, o displayName e o status de verificação já vêm do provedor.
      // Geralmente não é necessário enviar e-mail de verificação para contas Google.
      return result.user;
    } catch (err) {
      let errorMessage = "Erro ao entrar com o Google.";
      if (err.code === "auth/popup-closed-by-user") {
        errorMessage = "Login com Google cancelado.";
      } else {
        errorMessage = `Erro: ${err.message}`;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
    } catch (err) {
      setError("Erro ao fazer logout.");
      // console.error("Erro no logout:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loginWithEmail,
    loginWithGoogle,
    logout,
    error,
    loading
  };
};