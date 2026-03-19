import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard/Dashboard";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import styles from "./Layout.module.css";
import "./styles/index.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className={styles.root}>
        <main className={styles.content}>
          <Routes>
            <Route path="/" element={<Navigate to="/register" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}