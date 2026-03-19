import { Link } from "react-router-dom";
import styles from "./Auth.module.css";

export default function Register() {
  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.logo}>
          <img src="/icons/logo.svg" alt="" />
          FitCon
        </div>
        <h1 className={styles.title}>Создать аккаунт</h1>
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.field}>
            <label>Имя пользователя</label>
            <input type="text" placeholder="Как вас зовут?" />
          </div>
          <div className={styles.field}>
            <label>Электронная почта</label>
            <input type="email" placeholder="example@mail.com" />
          </div>
          <div className={styles.field}>
            <label>Пароль</label>
            <input type="password" placeholder="Минимум 8 символов" />
          </div>
          <div className={styles.field}>
            <label>Повторите пароль</label>
            <input type="password" placeholder="••••••••" />
          </div>
          <button type="submit" className={styles.submitBtn}>Регистрация</button>
        </form>
        <p className={styles.footer}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
}