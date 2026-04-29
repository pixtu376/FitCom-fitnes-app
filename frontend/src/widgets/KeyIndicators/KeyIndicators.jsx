import React, { useMemo } from 'react';
import styles from './KeyIndicators.module.css';

export default function KeyIndicators({ stats }) {
  const indicators = useMemo(() => {
    if (!stats) return [];
    return stats
      .filter(s => s.targets?.length > 0)
      .slice(0, 5)
      .map(stat => {
        const target = stat.targets[0];
        const current = parseFloat(stat.value) || 0;
        const goal = parseFloat(target.target_value) || 0;
        const isUp = !!(target.is_up === true || target.is_up === 1 || String(target.is_up) === "1");
        const progress = goal > 0 ? (isUp ? (current / goal) : (goal / (current || 1))) * 100 : 0;

        return {
          id: stat.stat_id,
          name: stat.name_stat,
          current,
          goal,
          unit: stat.unit,
          progress: Math.min(Math.max(progress, 0), 100)
        };
      });
  }, [stats]);

  if (indicators.length === 0) return null;

  return (
    <div className={styles.wrapper}>
      <h3 className="card-title">Ключевые показатели</h3>
      
      <div className={styles.grid}>
        {indicators.map((ind) => (
          <div key={ind.id} className={styles.row}>
            <div className={styles.topLine}>
              <span className={styles.label}>
                {ind.name}: <span className={styles.val}>{ind.current} {ind.unit}</span>
              </span>
              <span className={styles.percent}>{Math.round(ind.progress)}%</span>
            </div>
            
            <div className={styles.barTrack}>
              <div className={styles.barFill} style={{ width: `${ind.progress}%` }} />
            </div>

            <div className={styles.goalLine}>Цель: {ind.goal}</div>
          </div>
        ))}
      </div>
    </div>
  );
}