import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import styles from "./WeightChart.module.css";

export default function WeightChart({ data }) {
  
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return data.map(item => ({
      name: new Date(item.created_at).toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' }),
      weight: parseFloat(item.weight)
    }));
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.empty}>Нет данных для аналитики</div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.arrow}>&lt;</span>
        <span>История веса (кг)</span>
        <span className={styles.arrow}>&gt;</span>
      </div>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3139" vertical={false} />
            
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />

            <YAxis 
              stroke="#9ca3af" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              domain={['dataMin - 1', 'dataMax + 1']}
            />

            <Tooltip 
              contentStyle={{ backgroundColor: '#1e2126', border: 'none', borderRadius: '8px', fontSize: '12px' }}
              itemStyle={{ color: '#4ade80' }}
              labelStyle={{ color: '#9ca3af', marginBottom: '4px' }}
              formatter={(value) => [`${value} кг`, 'Вес']}
            />

            <Area 
              type="monotone" 
              dataKey="weight" 
              stroke="#4ade80" 
              fill="url(#colorWeight)" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#4ade80', strokeWidth: 2, stroke: '#111' }} // Точки на графике
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}