import React from "react";
import styles from "./Calendar.module.css";

export default function Calendar({ plans = [], isMobile = false }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const weekLabels = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

  const generateDays = () => {
    const year = today.getFullYear();
    const month = today.getMonth();
    
    if (isMobile) {
      const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1; // ПН = 0
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - dayOfWeek);
      
      return [...Array(7)].map((_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return { d: d.getDate(), fullDate: d, current: true };
      });
    }

    const firstDay = new Date(year, month, 1).getDay();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    let calendarDays = [];
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
    return calendarDays.map(day => ({
      ...day,
      fullDate: new Date(year, month + (day.offset || 0), day.d)
    }));
  };

  const checkWorkout = (date) => {
    const activePlan = plans?.find(p => String(p.is_active) === "1") || plans?.[0];
    if (!activePlan?.training_days) return false;
    const dbDaysMap = { 1: "Пн", 2: "Вт", 3: "Ср", 4: "Чт", 5: "Пт", 6: "Сб", 0: "Вс" };
    return activePlan.training_days.some(td => td.week_day?.trim() === dbDaysMap[date.getDay()]);
  };

  const days = generateDays();

  return (
    <div className={`${styles.calendarContainer} ${isMobile ? styles.mobileMode : ""}`}>
      {!isMobile && (
        <div className={styles.monthTitle}>
          {today.toLocaleString('ru-RU', { month: 'long' })}
        </div>
      )}

      {!isMobile && (
        <div className={styles.weekDays}>
          {weekLabels.map(d => <div key={d} className={styles.weekLabel}>{d}</div>)}
        </div>
      )}

      <div className={isMobile ? styles.mobileGrid : styles.grid}>
        {days.map((day, i) => {
          const workout = checkWorkout(day.fullDate);
          const isToday = day.fullDate.getTime() === today.getTime();
          const dayIdx = day.fullDate.getDay() === 0 ? 6 : day.fullDate.getDay() - 1;

          return (
            <div key={i} className={styles.dayWrapper}>
              {isMobile && (
                <span className={`${styles.mobileWeekLabel} ${isToday ? styles.activeText : ""}`}>
                  {weekLabels[dayIdx]}
                </span>
              )}
              <div className={`
                ${styles.dayCell} 
                ${!day.current ? styles.notCurrent : ''} 
                ${isToday ? styles.today : ''} 
                ${workout ? styles.hasWorkout : ''}
              `}>
                {day.d}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}