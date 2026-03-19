import { Link } from "react-router-dom";
import styles from "./Auth.module.css";

export default function Login() {
  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.logo}>
          <img src="/icons/logo.svg" alt="" />
          FitCon
        </div>
        <h1 className={styles.title}>Вход в систему</h1>
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.field}>
            <label>Email / Логин</label>
            <input type="text" placeholder="Введите почту или никнейм" />
          </div>
          <div className={styles.field}>
            <label>Пароль</label>
            <input type="password" placeholder="••••••••" />
          </div>
          <button type="submit" className={styles.submitBtn}>Войти</button>
        </form>
        <p className={styles.footer}>
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}