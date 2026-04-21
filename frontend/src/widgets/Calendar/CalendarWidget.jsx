import React, { useState } from "react";
import styles from "./Calendar.module.css";

export default function Calendar({ plans = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activePlan = plans?.find(p => String(p.is_active) === "1") || plans?.[0];

  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const generateDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const calendarDays = [];
    for (let i = startOffset; i > 0; i--) {
      calendarDays.push({ d: daysInPrevMonth - i + 1, current: false, offset: -1 });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push({ d: i, current: true, offset: 0 });
    }
    const remaining = (7 - (calendarDays.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      calendarDays.push({ d: i, current: false, offset: 1 });
    }
    return calendarDays;
  };

  const checkWorkout = (dayNumber, monthOffset) => {
    if (!activePlan?.training_days) return null;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, dayNumber);
    date.setHours(0, 0, 0, 0);

    const planStart = new Date(activePlan.start_date);
    const planEnd = new Date(activePlan.end_date);
    if (date < planStart || date > planEnd) return null;

    const dbDaysMap = { 1: "Пн", 2: "Вт", 3: "Ср", 4: "Чт", 5: "Пт", 6: "Сб", 0: "Вс" };
    const currentDayLabel = dbDaysMap[date.getDay()];
    return activePlan.training_days.find(td => td.week_day?.trim() === currentDayLabel);
  };

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.header}>
        <button onClick={() => changeMonth(-1)} className={styles.arrow}>&lt;</button>
        <span className={styles.monthTitle}>
          {currentDate.toLocaleString('ru-RU', { month: 'long' })}
        </span>
        <button onClick={() => changeMonth(1)} className={styles.arrow}>&gt;</button>
      </div>

      <div className={styles.weekDays}>
        {['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'].map(d => (
          <div key={d} className={styles.weekDayLabel}>{d}</div>
        ))}
      </div>

      <div className={styles.grid}>
        {generateDays().map((day, i) => {
          const workout = checkWorkout(day.d, day.offset);
          const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + day.offset, day.d);
          cellDate.setHours(0, 0, 0, 0);

          const isToday = cellDate.getTime() === today.getTime();
          
          return (
            <div 
              key={i} 
              className={`
                ${styles.dayCell} 
                ${!day.current ? styles.notCurrent : ''} 
                ${isToday ? styles.today : ''} 
                ${workout ? styles.hasWorkout : ''}
              `}
            >
              <span className={styles.dayNumber}>{day.d}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}