import React from 'react';
import styles from './KeyIndicators.module.css';

export default function KeyIndicators({ stats }) {
  if (!stats) return null;

  const targetStats = stats.filter(s => s.targets && s.targets.length > 0);

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Ключевые показатели</h3>
      
      <div className={styles.indicatorsList}>
        {targetStats.map(stat => {
          const target = stat.targets[0];
          const current = parseFloat(stat.value) || 0;
          const goal = parseFloat(target.target_value) || 0;
          const isUp = target.is_up === true || target.is_up === 1 || String(target.is_up) === "1";

          let rawProgress = 0;
          if (goal > 0) {
            rawProgress = isUp ? (current / goal) * 100 : (goal / current) * 100;
          }

          const finalProgress = Math.min(Math.max(rawProgress, 0), 100);

          return (
            <div key={stat.stat_id} className={styles.indicatorGroup}>
              <div className={styles.indicatorHeader}>
                <span>
                  {stat.name_stat}: 
                  <span className={styles.accent}>{current} {stat.unit}</span>
                </span>
                <span>Цель: {goal}</span>
              </div>
              
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${finalProgress}%` }}
                ></div>
              </div>

              <div className={styles.percentageText}>
                {Math.round(finalProgress)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}