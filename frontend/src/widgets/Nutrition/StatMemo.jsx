import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import api from "../../app/api";
import styles from "./StatMemo.module.css";

const COLORS = ["#4ade80", "#5383b1", "#e5a55d", "#71c391"];

export default function NutritionMemo({ isMobile }) {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ["userStats"],
    queryFn: async () => {
      const response = await api.get("/user/view_stat");
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const { displayRows, totalProgress, chartData, isEmptyData } = useMemo(() => {
    const rawStats = Array.isArray(stats) ? stats : [];
    
    // Фильтруем показатели с целями
    const targetStats = rawStats.filter(s => s.targets && s.targets.length > 0);

    // 1. Формируем данные для списка и баров (макс 4)
    const indicators = targetStats.slice(0, 4).map((stat, index) => {
      const target = stat.targets[0];
      const current = parseFloat(stat.value) || 0;
      const goal = parseFloat(target.target_value) || 0;
      const isUp = target.is_up === true || target.is_up === 1 || String(target.is_up) === "1";

      let progress = 0;
      if (goal > 0) {
        progress = isUp ? (current / goal) * 100 : (current === 0 ? 0 : (goal / current) * 100);
      }
      
      const finalProgress = Math.min(Math.max(progress, 0), 100);

      return {
        id: stat.stat_id || `stat-${index}`,
        label: stat.name_stat,
        val: `${current} ${stat.unit || ""}`,
        progress: finalProgress,
        color: COLORS[index % COLORS.length],
        isEmpty: false
      };
    });

    // Расчет общего прогресса для центра
    const total = indicators.length > 0
      ? Math.round(indicators.reduce((acc, curr) => acc + curr.progress, 0) / indicators.length)
      : 0;

    // Добавляем заглушки для списка (слева)
    const rows = [...indicators];
    while (rows.length < 4) {
      rows.push({
        id: `stub-${rows.length}`,
        label: "—",
        val: "Нет данных",
        progress: 0,
        color: "rgba(255,255,255,0.05)",
        isEmpty: true
      });
    }

    // 2. Формируем данные ТОЛЬКО для PieChart (справа)
    let finalChartData = [];
    let isDataEmpty = false;

    if (indicators.length > 0) {
      // Нормализуем прогресс, чтобы сумма была 100% для полного круга
      const sumProgress = indicators.reduce((acc, curr) => acc + curr.progress, 0);
      
      if (sumProgress > 0) {
        // Если прогресс есть, делим круг пропорционально вкладу каждой цели
        finalChartData = indicators.map(ind => ({
          ...ind,
          // Вклад конкретной цели в общую сумму прогресса (в масштабе 100%)
          normalizedValue: (ind.progress / sumProgress) * 100
        }));
      } else {
        // Если цели есть, но прогресс по всем 0%, рисуем один полный серый сегмент
        isDataEmpty = true;
        finalChartData = [{ normalizedValue: 100, color: "rgba(255,255,255,0.1)" }];
      }
    } else {
      // Если вообще нет целей, рисуем один серый сегмент
      isDataEmpty = true;
      finalChartData = [{ normalizedValue: 100, color: "rgba(255,255,255,0.1)" }];
    }

    return { 
      displayRows: rows, 
      totalProgress: total, 
      chartData: finalChartData, // Используем normalizedValue для dataKey
      isEmptyData: isDataEmpty 
    };
  }, [stats]);

  if (isLoading) return <div className={styles.loadingPlaceholder}>Загрузка...</div>;
  if (isError) return <div className={styles.errorPlaceholder}>Ошибка</div>;

  return (
    <div className={`${styles.container} ${isMobile ? styles.mobileLayout : ""}`}>
      {/* Список слева (всегда 4 строки) */}
      <div className={styles.stats}>
        {displayRows.map((s) => (
          <div key={s.id} className={styles.row}>
            <div className={styles.labelRow}>
              <span className={styles.statLabel}>{s.label}</span>
              <span className={styles.val}>
                {s.val} {!s.isEmpty && <span className={styles.percentText}>{Math.round(s.progress)}%</span>}
              </span>
            </div>
            <div className={styles.barBg}>
              <div 
                className={styles.barFill} 
                style={{ 
                  width: `${s.isEmpty ? 0 : s.progress}%`, 
                  backgroundColor: s.color,
                  transition: 'width 1s ease-out'
                }} 
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Диаграмма справа (полная) */}
      <div className={styles.chartSide}>
        <div className={styles.pieWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={chartData} 
                innerRadius={35} 
                outerRadius={50} 
                dataKey="normalizedValue" // Ключ с нормализованными процентами
                stroke="none"
                // Если данных нет, padding не нужен, иначе будет разрыв
                paddingAngle={isEmptyData ? 0 : 4} 
                startAngle={90}
                endAngle={-270}
                isAnimationActive={true}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    // Немного скруглим углы, если это реальные данные
                    cornerRadius={isEmptyData ? 0 : 4}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className={styles.pieCenter}>
            <div className={styles.totalNum}>{totalProgress}%</div>
            <div className={styles.totalSub}>ЦЕЛИ</div>
          </div>
        </div>
      </div>
    </div>
  );
}