import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <img src="/icons/logo.svg" alt="" className={styles.logoIcon} />
        FitCon
      </div>
      <nav className={styles.nav}>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
          <img src="/icons/home.svg" className={styles.icon} alt="" />
          Главная
        </NavLink>
        <NavLink to="/training" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
          <img src="/icons/gym.svg" className={styles.icon} alt="" />
          Тренировки
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
          <img src="/icons/chart.svg" className={styles.icon} alt="" />
          Аналитика
        </NavLink>
        <NavLink to="/timer" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
          <img src="/icons/clock.svg" className={styles.icon} alt="" />
          В зале
        </NavLink>
      </nav>
      <div className={styles.bottom}>
        <div className={styles.user}>
          <img src="/icons/user.svg" className={styles.icon} alt="" />
          Логин/Имя
        </div>
        <div className={styles.link}>
          <img src="/icons/settings.svg" className={styles.icon} alt="" />
          Настройки
        </div>
      </div>
    </aside>
  );
}