import React from 'react';
import styles from './KeyIndicators.module.css';

export default function KeyIndicators({ stats }) {
  // Фильтруем только те статы, у которых есть массив targets и в нем есть хотя бы один элемент
  const targetStats = stats.filter(s => s.targets && s.targets.length > 0);

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Ключевые показатели</h3>
      {targetStats.map(stat => {
        const target = stat.targets[0];
        
        // Превращаем в числа принудительно
        const current = parseFloat(stat.value) || 0;
        const goal = parseFloat(target.target_value) || 0;
        
        // Проверяем направление. 
        // ВАЖНО: Проверь в консоли, как приходит is_up (true/false, 1/0 или "1"/"0")
        const isUp = target.is_up === true || target.is_up === 1 || String(target.is_up) === "1";

        let rawProgress = 0;

        if (goal > 0) {
          if (isUp) {
            // Рост: (80 / 100) * 100 = 80%
            rawProgress = (current / goal) * 100;
          } else {
            // Снижение: (85 / 91.8) * 100 = 92%
            // Если текущий вес МЕНЬШЕ цели (уже похудел), будет > 100%, что обрежется до 100.
            rawProgress = (goal / current) * 100;
          }
        }

        // Обрезаем края
        const finalProgress = Math.min(Math.max(rawProgress, 0), 100);

        // Отладка в консоль — нажми F12 в браузере и посмотри вкладку Console
        console.log(`Stat: ${stat.name_stat}`, { current, goal, isUp, finalProgress });

        return (
          <div key={stat.stat_id} className={styles.indicatorGroup}>
            <div className={styles.indicatorHeader}>
              <span>
                {stat.name_stat}: <span className={styles.accent}>{current} {stat.unit}</span>
              </span>
              <span>Цель: {goal} {stat.unit}</span>
            </div>
            
            <div className={styles.progressBar}>
              {/* Проверяем, что ширина передается корректно */}
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
  );
}