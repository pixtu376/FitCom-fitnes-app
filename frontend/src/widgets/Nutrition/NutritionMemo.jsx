import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import styles from "./NutritionMemo.module.css";

const pieData = [
  { name: "Протеин", value: 15, color: "#5383b1" },
  { name: "Жиры", value: 40, color: "#e5a55d" },
  { name: "Углеводы", value: 45, color: "#71c391" }
];

export default function NutritionMemo() {
  return (
    <div className={styles.container}>
      <div className={styles.stats}>
        {[
          { label: "Калории", val: "1850 / 2500 Ккал", p: 74, c: "#4ade80" },
          { label: "Протеин", val: "130 / 180 Г", p: 72, c: "#5383b1" },
          { label: "Жиры", val: "100 / 120 Г", p: 83, c: "#e5a55d" },
          { label: "Углеводы", val: "260 / 280 Г", p: 92, c: "#71c391" },
        ].map(s => (
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