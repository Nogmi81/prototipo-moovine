"use client";

import styles from "./Register.module.css";
import { useState } from "react";
import { useAuthentication } from "../hooks/useAuthentication";
import { useRouter } from "next/navigation";
import Link from "next/link";

const RegisterPage = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const {
    register,
    loginWithGoogle,
    error: authError,
    loading,
  } = useAuthentication();
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(""); // Sempre limpa erros anteriores ao tentar novamente

    if (senha !== confirmaSenha) {
      setError("As senhas precisam ser iguais.");
      return;
    }

    // Validação de senhas mínimas (exemplo)
    if (senha.length < 6) {
      setError("A senha precisa ter no mínimo 6 caracteres.");
      return;
    }

    const user = await register({ email, password: senha });
    if (user) {
      router.push("/Dashboard");
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
            value={nome}
            onChange={(e) => setNome(e.target.value)}
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
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onFocus={clearErrorOnFocus}
            required
          />
        </label>
        <label>
          <span>Confirme a senha: </span>
          <input
            type="password"
            placeholder="Confirme a senha"
            value={confirmaSenha}
            onChange={(e) => setConfirmaSenha(e.target.value)}
            onFocus={clearErrorOnFocus}
            required
          />
        </label>

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

        {/* Exibir erro logo abaixo do botão de submit */}
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
      </form>
      <p>
        Já tem uma conta? <Link href="/Login">Faça login aqui</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
