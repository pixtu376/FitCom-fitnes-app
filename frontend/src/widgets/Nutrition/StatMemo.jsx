import React, { useMemo, useCallback } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../../app/api";
import styles from "./StatMemo.module.css";

const COLORS = ["#4ade80", "#5383b1", "#e5a55d", "#71c391", "#a855f7"];

export default function NutritionMemo({ isMobile }) {
  const navigate = useNavigate();

  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ["userStats"],
    queryFn: async () => {
      const response = await api.get("/user/view_stat");
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const { displayRows, totalProgress, chartData, isEmptyData, hasAnyTargets } = useMemo(() => {
    const rawStats = Array.isArray(stats) ? stats : [];
    
    const targetStats = rawStats.filter(s => 
      s.targets && s.targets.length > 0 && s.targets.some(t => t.is_active === 1 || t.is_active === true)
    );

    const indicators = targetStats.slice(0, 5).map((stat, index) => {
      const target = stat.targets[0];
      const current = parseFloat(stat.value) || 0;
      const goal = parseFloat(target.target_value) || 0;
      const isUp = target.is_up === 1 || target.is_up === true;

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

    const total = indicators.length > 0
      ? Math.round(indicators.reduce((acc, curr) => acc + curr.progress, 0) / indicators.length)
      : 0;

    const rows = [...indicators];
    while (rows.length < 5) {
      rows.push({
        id: `stub-${rows.length}`,
        label: "—",
        val: "Нет данных",
        progress: 0,
        color: "rgba(255,255,255,0.05)",
        isEmpty: true
      });
    }

    let finalChartData = [];
    let isDataEmpty = indicators.length === 0;

    if (!isDataEmpty) {
      const sumProgress = indicators.reduce((acc, curr) => acc + curr.progress, 0);
      if (sumProgress > 0) {
        finalChartData = indicators.map(ind => ({
          ...ind,
          normalizedValue: (ind.progress / sumProgress) * 100
        }));
      } else {
        isDataEmpty = true;
      }
    }

    if (isDataEmpty) {
      finalChartData = [{ normalizedValue: 100, color: "rgba(255,255,255,0.1)" }];
    }

    return { 
      displayRows: rows, 
      totalProgress: total, 
      chartData: finalChartData,
      isEmptyData: isDataEmpty,
      hasAnyTargets: targetStats.length > 0
    };
  }, [stats]);

  const handleGoToProfile = useCallback(() => navigate("/Profile"), [navigate]);

  if (isLoading) return <div className={styles.placeholder}>Загрузка...</div>;
  if (isError) return <div className={styles.placeholder}>Ошибка</div>;

  if (!hasAnyTargets) {
    return (
      <div className={`${styles.container} ${styles.emptyState}`}>
        <div className={styles.emptyContent}>
          <p className={styles.emptyText}>Цели не заданы</p>
          <button className={styles.emptyBtn} onClick={handleGoToProfile}>
            Добавить в профиле
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${isMobile ? styles.mobileLayout : ""}`}>
      <div className={styles.stats}>
        {displayRows.map((s) => (
          <div key={s.id} className={styles.row}>
            <div className={styles.labelRow}>
              <span className={styles.statLabel} title={s.label}>{s.label}</span>
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
                }} 
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.chartSide}>
        <div className={styles.pieWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie 
                data={chartData} 
                innerRadius={isMobile ? 40 : 35} 
                outerRadius={isMobile ? 55 : 50} 
                dataKey="normalizedValue"
                stroke="none"
                paddingAngle={isEmptyData ? 0 : 4} 
                startAngle={90}
                endAngle={-270}
                isAnimationActive={true}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
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