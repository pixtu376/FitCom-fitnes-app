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
      console.log("Данные из Laravel:", response.data);
      return response.data;
    },
  });

  if (isLoading) return null;

  return (
    <div className={styles.dashboard}>
      <Sidebar user={user} />
      
      <main className={styles.dashboard}>
        <div className={styles.leftCol}>
          <div className={styles.card}>
            <Calendar />
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Аналитика</h3>
            <div className={styles.chartContainer}>
              <WeightChart data={user?.stats} />
            </div>
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Ближайшая тренировка:</h3>
            <div className={styles.listContainer}>
              <NextWorkout plan={user?.training_plans?.[0]} />
            </div>
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Памятка питания</h3>
            <div className={styles.chartContainer}>
              <NutritionMemo data={user?.bju?.[0]} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}