import React, { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import styles from "./WeightChart.module.css";

export default function WeightChart({ data = [] }) {
  const groupedData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return {};
    
    const groups = data.reduce((acc, item) => {
      const category = item.name_stat || "Общее"; 
      if (!acc[category]) acc[category] = [];
      
      acc[category].push({
        date: new Date(item.created_at).toLocaleDateString('ru-RU', { month: 'short' }),
        value: parseFloat(item.value),
        rawDate: new Date(item.created_at)
      });
      return acc;
    }, {});

    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => a.rawDate - b.rawDate);
    });

    return groups;
  }, [data]);

  const categories = Object.keys(groupedData);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (categories.length === 0) {
    return <div className={styles.empty}>Нет данных для анализа</div>;
  }

  const handlePrev = () => setCurrentIndex(prev => (prev - 1 + categories.length) % categories.length);
  const handleNext = () => setCurrentIndex(prev => (prev + 1) % categories.length);

  const currentCategory = categories[currentIndex];
  const chartData = groupedData[currentCategory] || [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={handlePrev} className={styles.arrow}>&lt;</button>
        <span className={styles.title}>
          {currentCategory} {currentCategory === "Вес" ? "(кг)" : "(см)"}
        </span>
        <button onClick={handleNext} className={styles.arrow}>&gt;</button>
      </div>

      <div className={styles.chartWrapper}>
        <div className={styles.chartInner}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#48CB9F" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#48CB9F" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                domain={['dataMin - 2', 'dataMax + 2']} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1A1D21', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '12px',
                  fontSize: '14px'
                }}
                itemStyle={{ color: '#48CB9F' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#48CB9F" 
                fill="url(#colorValue)" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#48CB9F', strokeWidth: 2, stroke: '#22252A' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}