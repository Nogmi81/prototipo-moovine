"use client";

import styles from "./Register.module.css";
import { useState, useEffect, useRef } from "react";
import { useAuthentication } from "../hooks/useAuthentication";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Modal from "../components/Modal/Modal"; // Certifique-se de que o caminho está correto

const RegisterPage = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const {
    register,
    loginWithGoogle,
    error: authError,
    loading,
  } = useAuthentication();

  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Novo useEffect para o timer do modal
  useEffect(() => {
    let timer;
    if (isModalOpen) {
      timer = setTimeout(() => {
        closeModal();
      }, 8000); // Fecha o modal após 8 segundos
    }

    // Função de limpeza para evitar vazamento de memória e fechar o timer se o modal for fechado manualmente
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isModalOpen]); // Roda sempre que isModalOpen mudar

  const router = useRouter();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    router.push("/Login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("As senhas precisam ser iguais.");
      return;
    }

    if (password.length < 6) {
      setError("A senha precisa ter no mínimo 6 caracteres.");
      return;
    }

    const user = await register({ email, password: password, displayName: displayName });
    if (user) {
      openModal();
    }
  };

  const handleGoogleLogin = async () => {
    const user = await loginWithGoogle();
    if (user) {
      router.push("/Dashboard");
    }
  };

  const clearErrorOnFocus = () => setError("");

  return (
    <div className={styles.container}>
      <h1>Cadastre-se para utilizar os recursos do moovine:</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Nome: </span>
          <input
            type="text"
            placeholder="Nome"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
        </label>
        <label>
          <span>E-mail: </span>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          <span>Senha: </span>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={clearErrorOnFocus}
            required
          />
        </label>
        <label>
          <span>Confirme a senha: </span>
          <input
            type="password"
            placeholder="Confirme a senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onFocus={clearErrorOnFocus}
            required
          />
        </label>

        {(error || authError) && (
          <p
            style={{
              color: "white",
              border: "1px dotted #FF7F26",
              backgroundColor: "red",
              padding: "8px",
            }}
          >
            {error || authError}
          </p>
        )}

        <button
          className={`${styles.btn} ${loading ? styles.loading : ""}`}
          type="submit"
          disabled={loading}
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>

        <button
          type="button"
          className={`${styles.btn} ${styles.googleBtn}`}
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          Entrar com Google
        </button>
      </form>
      <p>
        Já tem uma conta? <Link href="/Login">Faça login aqui</Link>
      </p>

      {isClient && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="Verificação de E-mail"
        >
          <p>Seu cadastro foi realizado com sucesso!</p>
          <p>Enviamos um e-mail de verificação para **{email}**. Por favor, verifique sua caixa de entrada (e spam) para confirmar sua conta.</p>          
        </Modal>
      )}
    </div>
  );
};

export default RegisterPage;
