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
    <div className={styles.container}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d3139" vertical={false} />
          <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
          <Area type="monotone" dataKey="weight" stroke="#4ade80" fill="#4ade80" fillOpacity={0.1} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}