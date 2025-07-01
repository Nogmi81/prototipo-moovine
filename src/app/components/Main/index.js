"use client";

import styles from "./Main.module.css";
import { useAuth } from "../../contexts/AuthContext";
import { usePathname } from "next/navigation";

export default function Main() {
  const { user, authLoading } = useAuth();
  const pathname = usePathname();

  if (authLoading) return <p>Carregando autenticação...</p>;

  const isDashboard = pathname === "/Dashboard";
  const isLoggedInDashboard = user && isDashboard;

  const mainClass = `${styles.main} ${isLoggedInDashboard ? styles.mainDashboard : ""}`;

  return (
    <main className={mainClass}>
      <h1>{isLoggedInDashboard ? "Dashboard" : "moovine - WorkSpace"}</h1>
      {!isLoggedInDashboard && (
        <>
          {user ? (
            <p>Bem-vindo, {user.name || user.email || "usuário"}!</p>
          ) : (
            <p className={styles.msgDeslogado}>Você não está autenticado.</p>
          )}
        </>
      )}
    </main>
  );
}
