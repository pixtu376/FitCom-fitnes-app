import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./MobileNav.module.css";

export default function MobileNav() {
  return (
    <nav className={styles.mobileNav}>
      <NavLink to="/training" className={({ isActive }) => isActive ? `${styles.item} ${styles.active}` : styles.item}>
        <div className={styles.iconContainer}>
            <img src="/icons/gym.svg" alt="Training" />
        </div>
        <span>Тренировки</span>
      </NavLink>
      
      <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${styles.item} ${styles.active}` : styles.item}>
        <div className={styles.iconGrid}>
            <span></span><span></span><span></span><span></span>
        </div>
        <span>Главная</span>
      </NavLink>

      <NavLink to="/analytics" className={({ isActive }) => isActive ? `${styles.item} ${styles.active}` : styles.item}>
        <div className={styles.iconContainer}>
            <img src="/icons/chart.svg" alt="Analytics" />
        </div>
        <span>Аналитика</span>
      </NavLink>

      <NavLink to="/InGym" className={({ isActive }) => isActive ? `${styles.item} ${styles.active}` : styles.item}>
        <div className={styles.iconContainer}>
            <img src="/icons/clock.svg" alt="InGym" />
        </div>
        <span>В зале</span>
      </NavLink>
    </nav>
  );
}