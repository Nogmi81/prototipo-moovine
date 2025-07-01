"use client";

import styles from "./Login.module.css";
import { useState } from "react";
import { useAuthentication } from "../hooks/useAuthentication";
import { useRouter } from "next/navigation";
import Link from "next/link";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const {
    loginWithEmail,
    loginWithGoogle,
    loading,
    error: authError
  } = useAuthentication();

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await loginWithEmail({ email, password: senha });
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

  return (
    <div className={styles.container}>
      <h1>Entre com sua conta Moovine:</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <span>E-mail:</span>
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          <span>Senha:</span>
          <input
            type="password"
            placeholder="Sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </label>

        <button
          className={`${styles.btn} ${loading ? styles.loading : ""}`}
          type="submit"
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <button
          type="button"
          className={`${styles.btn} ${styles.googleBtn}`}
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          Entrar com Google
        </button>

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
        Ainda não tem conta? <Link href="/Cadastro">Cadastre-se aqui</Link>
      </p>
    </div>
  );
};

export default LoginPage;
