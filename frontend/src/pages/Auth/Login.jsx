import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "../../app/api";
import styles from "./Auth.module.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: (data) => api.post("/login", data),
    onSuccess: (res) => {
      localStorage.removeItem("token");
      localStorage.setItem("token", res.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      navigate("/dashboard");
    },
    onError: () => alert("Неверный логин или пароль")
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.logo}>
          <img src="/icons/logo.svg" alt="" />
          FitCon
        </div>
        <h1 className={styles.title}>Вход в систему</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Email / Логин</label>
            <input 
              type="text" 
              placeholder="Введите почту" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label>Пароль</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Вход..." : "Войти"}
          </button>
        </form>
        <p className={styles.footer}>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}