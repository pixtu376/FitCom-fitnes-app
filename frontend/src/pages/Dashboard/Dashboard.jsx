import React, { useState, useEffect } from "react";
import Sidebar from "../../widgets/Sidebar/Sidebar";
import Calendar from "../../widgets/Calendar/CalendarWidget";
import NextWorkout from "../../widgets/NextWorkout/NextWorkout";
import WeightChart from "../../widgets/WeightChart/WeightChart";
import NutritionMemo from "../../widgets/Nutrition/StatMemo";
import MobileNav from "../../widgets/MobileNav/MobileNav";
import MobileHeader from "../../widgets/MobileHeader/MobileHeader"; 
import styles from "./Dashboard.module.css";
import { useQuery } from "@tanstack/react-query";
import api from "../../app/api";

export default function Dashboard() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1200);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      {!isMobile && (
        <div className={styles.sidebarDesktopWrapper}>
          <Sidebar user={user} />
        </div>
      )}
      
      <main className={styles.main}>
        {isMobile && <MobileHeader user={user} />}

        {isMobile && (
          <section className={styles.mobileCalendar}>
            <Calendar plans={user?.training_plans} isMobile={true} />
          </section>
        )}

      <div className={styles.contentGrid}>
      <div className={styles.leftCol}>
        {!isMobile && (
          <div className={styles.desktopCalendarCard}>
            <Calendar plans={user?.training_plans} isMobile={false} />
          </div>
        )}
        
        <div className={`${styles.card} ${styles.chartCard}`}>
          <h3 className={styles.cardTitle}>Аналитика</h3>
          <div className={styles.chartWrapper}>
            <WeightChart data={user?.stats} />
          </div>
        </div>
      </div>

      <div className={styles.rightCol}>
        <div className={`${styles.card} ${styles.workoutCard}`}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Ближайшая тренировка</h3>
            <span className={styles.accentText}>{user?.next_workout_date || "Завтра"}</span>
          </div>
          <NextWorkout plan={user?.training_plans?.[0]} />
        </div>

        <div className={styles.analyticsNutritionRow}>
          {isMobile && (
            <div className={`${styles.card} ${styles.chartCard}`}>
              <h3 className={styles.cardTitle}>Аналитика</h3>
              <div className={styles.chartWrapper}>
                <WeightChart data={user?.stats} />
              </div>
            </div>
          )}

          <div className={`${styles.card} ${styles.nutritionCard}`}>
            <h3 className={styles.cardTitle}>График целей</h3>
            <div className={styles.nutritionWrapper}>
              <NutritionMemo isMobile={isMobile} />
            </div>
          </div>
        </div>
      </div>
    </div>
      </main>

      {isMobile && <MobileNav />}
    </div>
  );
}