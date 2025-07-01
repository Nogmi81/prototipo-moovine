// app/dashboard/page.js
"use client";

import styles from "./Dashboard.module.css";
import Main from "../components/Main";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <p>Carregando...</p>;
  }

  if (!user) {
    return  <div className={styles.container}><p className={styles.msgDeslogado}>Você não está logado.</p></div>;
  }

  return (
    <div>
       <Main />
    </div>
  );
}
