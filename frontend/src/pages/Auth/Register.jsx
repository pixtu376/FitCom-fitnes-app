import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "../../app/api";
import styles from "./Auth.module.css";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });

  const registerMutation = useMutation({
    mutationFn: (data) => api.post("/register", data),
    onSuccess: (res) => {
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    },
    onError: (err) => alert(err.response?.data?.message || "Ошибка регистрации")
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      return alert("Пароли не совпадают");
    }
    registerMutation.mutate(formData);
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.logo}>
          <img src="/icons/logo.svg" alt="" />
          FitCon
        </div>
        <h1 className={styles.title}>Создать аккаунт</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Имя пользователя</label>
            <input 
              type="text" 
              placeholder="Как вас зовут?" 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required 
            />
          </div>
          <div className={styles.field}>
            <label>Электронная почта</label>
            <input 
              type="email" 
              placeholder="example@mail.com" 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>
          <div className={styles.field}>
            <label>Пароль</label>
            <input 
              type="password" 
              placeholder="Минимум 8 символов" 
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>
          <div className={styles.field}>
            <label>Повторите пароль</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
              required 
            />
          </div>
          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? "Создание..." : "Регистрация"}
          </button>
        </form>
        <p className={styles.footer}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
}