import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./MobileHeader.module.css";

export default function MobileHeader({ user }) {
  return (
    <header className={styles.mobileHeader}>
      <div className={styles.logoGroup}>
        <div className={styles.logoCircle}>
          <img src="/vite.svg" alt="F" />
        </div>
        <span className={styles.logoText}>FitCon</span>
      </div>
      <div className={styles.userSection}>
        <NavLink to="/Profile" className={styles.avatar}>
          <img src="/icons/user.svg" alt="User" />
        </NavLink>
      </div>
    </header>
  );
}