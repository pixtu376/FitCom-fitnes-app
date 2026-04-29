
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

const MENU_ITEMS = [
  { path: "/dashboard", label: "Главная", icon: "/icons/dashboard.svg" },
  { path: "/training", label: "Тренировки", icon: "/icons/gym.svg" },
  { path: "/analytics", label: "Аналитика", icon: "/icons/chart.svg" },
  { path: "/InGym", label: "В зале", icon: "/icons/clock.svg" },
];

const BOTTOM_ITEMS = [
  { path: "/Profile", label: "Логин/Имя", icon: "/icons/user.svg" },
  { path: null, label: "Настройки", icon: "/icons/settings.svg", isStatic: true },
];

const SidebarItem = ({ path, label, icon, isStatic }) => {
  const className = ({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`;
  const content = (
    <>
      <img src={icon} className={styles.icon} alt="" />
      <span>{label}</span>
    </>
  );

  if (isStatic) {
    return <div className={styles.link} key={label}>{content}</div>;
  }

  return (
    <NavLink 
      key={path} 
      to={path} 
      end={path === "/dashboard"} 
      className={className}
    >
      {content}
    </NavLink>
  );
};

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <img src="/vite.svg" alt="FitCon" className={styles.logoIcon} />
        <span>FitCon</span>
      </div>

      <nav className={styles.nav}>
        {MENU_ITEMS.map(SidebarItem)}
      </nav>

      <div className={styles.bottom}>
        {BOTTOM_ITEMS.map(SidebarItem)}
      </div>
    </aside>
  );
}