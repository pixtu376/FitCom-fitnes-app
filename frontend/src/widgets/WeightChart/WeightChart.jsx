import React, { useMemo, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import styles from "./WeightChart.module.css";

const GRADIENT_ID = "colorValue";
const CHART_COLORS = {
  stroke: "#48CB9F",
  grid: "rgba(255,255,255,0.05)",
  axis: "#64748b",
  tooltipBg: "#1A1D21",
  tooltipBorder: "rgba(255,255,255,0.1)",
  tooltipText: "#48CB9F",
  dotStroke: "#22252A"
};

const groupStatsByCategory = (data) => {
  if (!Array.isArray(data) || data.length === 0) return {};
  
  console.log("Данные, пришедшие в график:", data); // Отладка

  return data.reduce((acc, item) => {
    // Проверяем все возможные места, где может лежать название
    const category = item.stat_name?.name || item.name_stat;
    
    if (!category) {
      console.warn("У записи нет категории:", item);
      return acc;
    }

    if (!acc[category]) {
      acc[category] = {
        unit: item.unit || "",
        points: []
      };
    }
    
    const dateObj = new Date(item.created_at);
    
    acc[category].points.push({
      date: dateObj.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' }),
      value: parseFloat(item.value) || 0,
      rawDate: dateObj.getTime()
    });

    return acc;
  }, {});
};

export default function WeightChart({ data = [] }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const groupedData = useMemo(() => {
    const grouped = groupStatsByCategory(data);
    // Сортируем точки внутри каждой категории после группировки
    Object.values(grouped).forEach(g => g.points.sort((a, b) => a.rawDate - b.rawDate));
    return grouped;
  }, [data]);

  const categories = useMemo(() => Object.keys(groupedData), [groupedData]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + categories.length) % categories.length);
  }, [categories.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % categories.length);
  }, [categories.length]);

  if (categories.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyContent}>
          <p className={styles.emptyText}>Нет данных для анализа</p>
          <button className={styles.emptyLink} onClick={() => navigate("/analytics")}>
            Добавить замеры
          </button>
        </div>
      </div>
    );
  }

  const currentCategoryName = categories[currentIndex];
  const currentCategoryData = groupedData[currentCategoryName];
  const unitSuffix = currentCategoryData.unit ? `(${currentCategoryData.unit})` : "";

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={handlePrev} className={styles.arrow}>&lt;</button>
        <span className={styles.title}>{currentCategoryName} {unitSuffix}</span>
        <button onClick={handleNext} className={styles.arrow}>&gt;</button>
      </div>

      <div className={styles.chartWrapper}>
        <div className={styles.chartInner}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentCategoryData.points} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={CHART_COLORS.stroke} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={CHART_COLORS.stroke} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="0" stroke={CHART_COLORS.grid} vertical={false} />
              <XAxis dataKey="date" stroke={CHART_COLORS.axis} fontSize={10} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke={CHART_COLORS.axis} fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: CHART_COLORS.tooltipBg, border: `1px solid ${CHART_COLORS.tooltipBorder}`, borderRadius: '8px' }}
                itemStyle={{ color: CHART_COLORS.tooltipText }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={CHART_COLORS.stroke} 
                fill={`url(#${GRADIENT_ID})`} 
                strokeWidth={2} 
                dot={{ r: 3, fill: CHART_COLORS.stroke, strokeWidth: 1 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}