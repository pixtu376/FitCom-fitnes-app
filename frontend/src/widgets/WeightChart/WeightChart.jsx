import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import styles from "./WeightChart.module.css";

const data = [
  { name: "Сен", weight: 99 },
  { name: "Окт", weight: 96 },
  { name: "Ноя", weight: 95 },
  { name: "Дек", weight: 94 },
  { name: "Янв", weight: 91.5 },
];

export default function WeightChart() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.arrow}>&lt;</span>
        <span>Вес</span>
        <span className={styles.arrow}>&gt;</span>
      </div>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3139" vertical={false} />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
            <Area 
              type="monotone" 
              dataKey="weight" 
              stroke="#4ade80" 
              fill="url(#colorWeight)" 
              strokeWidth={2} 
            />
            <defs>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}