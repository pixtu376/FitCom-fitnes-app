import Calendar from "../../widgets/Calendar/CalendarWidget";
import NextWorkout from "../../widgets/NextWorkout/NextWorkout";
import WeightChart from "../../widgets/WeightChart/WeightChart";
import NutritionMemo from "../../widgets/Nutrition/NutritionMemo";
import Sidebar from "../../widgets/Sidebar/Sidebar";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <Sidebar />
      <div className={styles.leftCol}>
        <div className={styles.card}>
          <Calendar />
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Аналитика</h3>
          </div>
          <WeightChart />
        </div>
      </div>
      <div className={styles.rightCol}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Ближайшая тренировка:</h3>
          </div>
          <NextWorkout />
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Памятка питания</h3>
          </div>
          <NutritionMemo />
        </div>
      </div>
    </div>
  );
}