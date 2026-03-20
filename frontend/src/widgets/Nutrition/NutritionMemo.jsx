import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import styles from "./NutritionMemo.module.css";

export default function NutritionMemo({ data }) {
  const pieData = [
    { name: "Белки", value: data?.protein || 0, color: "#5383b1" },
    { name: "Жиры", value: data?.fats || 0, color: "#e5a55d" },
    { name: "Углеводы", value: data?.carbohydrates || 0, color: "#71c391" }
  ];

  const stats = [
    { label: "Калории", val: `${data?.calories || 0} Ккал`, c: "#4ade80" },
    { label: "Белки", val: `${data?.protein || 0} Г`, c: "#5383b1" },
    { label: "Жиры", val: `${data?.fats || 0} Г`, c: "#e5a55d" },
    { label: "Углеводы", val: `${data?.carbohydrates || 0} Г`, c: "#71c391" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.stats}>
        {stats.map(s => (
          <div key={s.label} className={styles.row}>
            <div className={styles.labelRow}>
              <span>{s.label}</span>
              <span className={styles.val}>{s.val}</span>
            </div>
            <div className={styles.barBg}>
              <div className={styles.barFill} style={{ width: `${s.p}%`, backgroundColor: s.c }} />
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.chartSide}>
        <div className={styles.pieWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} innerRadius={30} outerRadius={45} dataKey="value" stroke="none">
                {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.pieLabel}>БЖУ</div>
        </div>
        <div className={styles.legend}>
          {pieData.map(d => (
            <div key={d.name} className={styles.legendItem}>
              <span className={styles.dot} style={{ backgroundColor: d.color }} />
              {d.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}