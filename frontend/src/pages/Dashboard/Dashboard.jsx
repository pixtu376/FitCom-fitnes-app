import React from "react";
import Sidebar from "../../widgets/Sidebar/Sidebar";
import Calendar from "../../widgets/Calendar/CalendarWidget";
import NextWorkout from "../../widgets/NextWorkout/NextWorkout";
import WeightChart from "../../widgets/WeightChart/WeightChart";
import NutritionMemo from "../../widgets/Nutrition/NutritionMemo";
import styles from "./Dashboard.module.css";
import { useQuery } from "@tanstack/react-query";
import api from "../../app/api";

export default function Dashboard() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const response = await api.get("/user");
      return response.data;
    },
  });

  if (isLoading) return null;

  return (
    <div className={styles.layout}>
      <Sidebar user={user} />
      
      <main className={styles.main}>
        <div className={styles.contentGrid}>
          
          <section className={styles.leftCol}>
            <div className={styles.calendarCard}>
              <Calendar plans={user?.training_plans} />
            </div>
            
            <div className={`${styles.card} ${styles.chartCard}`}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Аналитика веса</h3>
                <span className={styles.cardSubtitle}>Последние 6 месяцев</span>
              </div>
              <div className={styles.chartContainer}>
                <WeightChart data={user?.stats} />
              </div>
            </div>
          </section>

          <section className={styles.rightCol}>
            <div className={`${styles.card} ${styles.workoutCard}`}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Ближайшая тренировка</h3>
                <span className={styles.accentText}>
                  {user?.next_workout_date || "Завтра"}
                </span>
              </div>
              <div className={styles.listContainer}>
                <NextWorkout plan={user?.training_plans?.[0]} />
              </div>
            </div>

            <div className={`${styles.card} ${styles.nutritionCard}`}>
              <h3 className={styles.cardTitle}>Памятка питания</h3>
              <div className={styles.nutritionContent}>
                <NutritionMemo goals={user?.nutrition_goals} />
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}