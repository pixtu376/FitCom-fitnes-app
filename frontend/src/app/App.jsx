import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Analytics from "../pages/Analytics/Analytics";
import TrainingPage from "../pages/Trainings/TrainingPage";
import InGym from "../pages/InGym/InGym";
import "./styles/index.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/training" element={<TrainingPage />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/InGym" element={<InGym />} />
    </Routes>
  );
}