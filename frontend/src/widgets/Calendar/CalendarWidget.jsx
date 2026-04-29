import React, { useMemo, useCallback } from "react";
import styles from "./Calendar.module.css";

const WEEK_LABELS = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
const DB_DAYS_MAP = { 1: "Пн", 2: "Вт", 3: "Ср", 4: "Чт", 5: "Пт", 6: "Сб", 0: "Вс" };

const getDayIndex = (date) => (date.getDay() === 0 ? 6 : date.getDay() - 1);

const generateWeekDays = (baseDate) => {
  const dayOfWeek = getDayIndex(baseDate);
  const startOfWeek = new Date(baseDate);
  startOfWeek.setDate(baseDate.getDate() - dayOfWeek);
  
  return [...Array(7)].map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return { 
      day: d.getDate(), 
      fullDate: d, 
      isCurrentMonth: true,
      dayIndex: getDayIndex(d)
    };
  });
};

const generateMonthGrid = (baseDate) => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  
  const firstDay = new Date(year, month, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  let calendarDays = [];
  
  for (let i = startOffset; i > 0; i--) {
    calendarDays.push({ 
      day: daysInPrevMonth - i + 1, 
      isCurrentMonth: false,
      offset: -1 
    });
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ 
      day: i, 
      isCurrentMonth: true, 
      offset: 0 
    });
  }

  const remaining = (7 - (calendarDays.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    calendarDays.push({ 
      day: i, 
      isCurrentMonth: false, 
      offset: 1 
    });
  }
  
  return calendarDays.map(day => ({
    ...day,
    fullDate: new Date(year, month + (day.offset || 0), day.day),
    dayIndex: getDayIndex(new Date(year, month + (day.offset || 0), day.day))
  }));
};

const buildWorkoutSet = (plans) => {
  if (!plans?.length) return new Set();
  
  const activePlan = plans.find(p => String(p.is_active) === "1") || plans[0];
  if (!activePlan?.training_days) return new Set();
  
  return new Set(
    activePlan.training_days
      .map(td => td.week_day?.trim())
      .filter(Boolean)
  );
};

export default function Calendar({ plans = [], isMobile = false }) {
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const workoutDaysSet = useMemo(() => buildWorkoutSet(plans), [plans]);
  
  const days = useMemo(() => {
    return isMobile 
      ? generateWeekDays(today) 
      : generateMonthGrid(today);
  }, [isMobile, today]);

  const hasWorkout = useCallback((date) => {
    const weekDay = DB_DAYS_MAP[date.getDay()];
    return workoutDaysSet.has(weekDay);
  }, [workoutDaysSet]);

  const dayItems = useMemo(() => {
    return days.map(day => {
      const isToday = day.fullDate.getTime() === today.getTime();
      const workout = hasWorkout(day.fullDate);
      
      return {
        ...day,
        isToday,
        hasWorkout: workout,
        cssClass: `${styles.dayCell} ${!day.isCurrentMonth ? styles.notCurrent : ''} ${isToday ? styles.today : ''} ${workout ? styles.hasWorkout : ''}`
      };
    });
  }, [days, today, hasWorkout]);

  return (
    <div className={`${styles.calendarContainer} ${isMobile ? styles.mobileMode : ""}`}>
      {!isMobile && (
        <div className={styles.monthTitle}>
          {today.toLocaleString('ru-RU', { month: 'long' })}
        </div>
      )}

      {!isMobile && (
        <div className={styles.weekDays}>
          {WEEK_LABELS.map(label => (
            <div key={label} className={styles.weekLabel}>{label}</div>
          ))}
        </div>
      )}

      <div className={isMobile ? styles.mobileGrid : styles.grid}>
        {dayItems.map((item, index) => (
          <div key={index} className={styles.dayWrapper}>
            {isMobile && (
              <span className={`${styles.mobileWeekLabel} ${item.isToday ? styles.activeText : ""}`}>
                {WEEK_LABELS[item.dayIndex]}
              </span>
            )}
            <div className={item.cssClass}>
              {item.day}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}