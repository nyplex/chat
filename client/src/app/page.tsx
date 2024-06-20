"use client";

import styles from "./page.module.css";
import Router from "next/router";

export default function Home() {
  const fetchData = async () => {
    try {
      const res = await fetch("/api/auth/currentuser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(res);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1>Login</h1>
        <button onClick={fetchData}>FETCH</button>
      </div>
    </main>
  );
}
