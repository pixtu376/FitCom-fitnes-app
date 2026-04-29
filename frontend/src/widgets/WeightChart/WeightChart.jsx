import React, { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import styles from "./WeightChart.module.css";

const GRADIENT_ID = "colorValue";
const CHART_COLORS = {
  stroke: "#48CB9F",
  fillStart: "rgba(72, 203, 159, 0.3)",
  fillEnd: "rgba(72, 203, 159, 0)",
  grid: "rgba(255,255,255,0.05)",
  axis: "#64748b",
  tooltipBg: "#1A1D21",
  tooltipBorder: "rgba(255,255,255,0.1)",
  tooltipText: "#48CB9F",
  dotStroke: "#22252A"
};

const CATEGORY_UNITS = {
  "Вес": "(кг)",
  "по умолчанию": "(см)"
};

const groupStatsByCategory = (data) => {
  if (!Array.isArray(data) || data.length === 0) return {};
  
  const groups = data.reduce((acc, item) => {
    const category = item.name_stat || "Общее";
    if (!acc[category]) acc[category] = [];
    
    acc[category].push({
      date: new Date(item.created_at).toLocaleDateString('ru-RU', { month: 'short' }),
      value: parseFloat(item.value) || 0,
      rawDate: new Date(item.created_at).getTime()
    });
    return acc;
  }, {});

  Object.values(groups).forEach(group => 
    group.sort((a, b) => a.rawDate - b.rawDate)
  );

  return groups;
};

const getUnitSuffix = (category) => {
  if (category === "Вес") return "(кг)";
  return "(см)";
};

export default function WeightChart({  data = [] }) {
  const navigate = useNavigate();

  const groupedData = useMemo(() => 
    groupStatsByCategory(data), 
  [data]);

  const categories = useMemo(() => Object.keys(groupedData), [groupedData]);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + categories.length) % categories.length);
  }, [categories.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % categories.length);
  }, [categories.length]);

  const handleGoToAnalytics = useCallback(() => {
    navigate("/analytics");
  }, [navigate]);

  if (categories.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyContent}>
          <div className={styles.emptyIcon}>📊</div>
          <p className={styles.emptyText}>Нет данных для анализа</p>
          <p className={styles.emptyHint}>
            Добавляйте замеры во вкладке <button className={styles.emptyLink} onClick={handleGoToAnalytics}>«Аналитика»</button>
          </p>
        </div>
      </div>
    );
  }

  const currentCategory = categories[currentIndex];
  const chartData = groupedData[currentCategory] || [];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={handlePrev} className={styles.arrow} aria-label="Предыдущая категория">&lt;</button>
        
        <span className={styles.title}>
          {currentCategory} {getUnitSuffix(currentCategory)}
        </span>
        
        <button onClick={handleNext} className={styles.arrow} aria-label="Следующая категория">&gt;</button>
      </div>

      <div className={styles.chartWrapper}>
        <div className={styles.chartInner}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.stroke} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={CHART_COLORS.stroke} stopOpacity={0}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="0" 
                stroke={CHART_COLORS.grid} 
                vertical={false} 
              />
              
              <XAxis 
                dataKey="date" 
                stroke={CHART_COLORS.axis} 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              
              <YAxis 
                stroke={CHART_COLORS.axis} 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                domain={['dataMin - 2', 'dataMax + 2']} 
              />
              
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: CHART_COLORS.tooltipBg, 
                  border: `1px solid ${CHART_COLORS.tooltipBorder}`, 
                  borderRadius: '12px',
                  fontSize: '14px'
                }}
                itemStyle={{ color: CHART_COLORS.tooltipText }}
              />
              
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={CHART_COLORS.stroke} 
                fill={`url(#${GRADIENT_ID})`} 
                strokeWidth={3} 
                dot={{ 
                  r: 4, 
                  fill: CHART_COLORS.stroke, 
                  strokeWidth: 2, 
                  stroke: CHART_COLORS.dotStroke 
                }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}