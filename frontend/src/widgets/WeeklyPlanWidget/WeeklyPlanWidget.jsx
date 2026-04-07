import React from 'react';
import styles from './WeeklyPlanWidget.module.css';
import Icon from '../Icons/Icons'; // Путь до твоего компонента Icon

export default function WeeklyPlanWidget({ days = [] }) {
  const weekLayout = [
    { label: 'Пн', key: 'Пн' },
    { label: 'Вт', key: 'Вт' },
    { label: 'Ср', key: 'Ср' },
    { label: 'Чт', key: 'Чт' },
    { label: 'Пт', key: 'Пт' },
    { label: 'Сб', key: 'Сб' },
    { label: 'Вс', key: 'Вс' },
  ];

  const DEFAULT_STYLE = {
    color: '#4a5568',
    icon: 'rest',
    label: 'Выходной'
  };

  return (
    <div className={styles.weekGrid}>
      {weekLayout.map((dayItem) => {
        const dbDay = days.find(d => d.week_day === dayItem.key);
        const isWorkday = !!dbDay;
        
        const displayColor = isWorkday ? dbDay.color : DEFAULT_STYLE.color;
        const displayIcon = isWorkday ? dbDay.icon : DEFAULT_STYLE.icon;
        const displayName = isWorkday 
          ? (dbDay.name || 'Тренировка') 
          : DEFAULT_STYLE.label;

        return (
          <div key={dayItem.key} className={styles.dayCard}>
            <span className={styles.dayLabel}>{dayItem.label}</span>
            
            <div 
              className={styles.iconCircle} 
              style={{ 
                backgroundColor: `${displayColor}20`, 
                border: `1px solid ${displayColor}` 
              }}
            >
              {/* ЗАМЕНА <img> на <Icon /> */}
              <Icon 
                name={displayIcon} 
                color={displayColor} 
                size={24} 
              />
            </div>

            <span 
              className={styles.statusText} 
              style={{ color: isWorkday ? '#fff' : '#718096' }}
            >
              {displayName}
            </span>

            <div 
              className={styles.indicator} 
              style={{ backgroundColor: displayColor }}
            />
          </div>
        );
      })}
    </div>
  );
}