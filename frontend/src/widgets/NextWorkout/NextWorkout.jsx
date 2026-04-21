import React, { useMemo } from "react";
import styles from "./NextWorkout.module.css";
import api from "../../app/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function NextWorkout({ plan }) {
  const queryClient = useQueryClient();

  const nextData = useMemo(() => {
    if (!plan?.training_days || plan.training_days.length === 0) return null;

    const daysMap = { "Пн": 1, "Вт": 2, "Ср": 3, "Чт": 4, "Пт": 5, "Сб": 6, "Вс": 0 };
    const now = new Date();
    const currentDayIdx = now.getDay();

    let closestDay = null;
    let daysUntil = 8;

    plan.training_days.forEach(day => {
      const targetIdx = daysMap[day.week_day?.trim()];
      let diff = targetIdx - currentDayIdx;
      if (diff < 0) diff += 7;
      if (diff < daysUntil) {
        daysUntil = diff;
        closestDay = day;
      }
    });

    return { day: closestDay, daysUntil };
  }, [plan]);

  const mutation = useMutation({
    mutationFn: ({ id, weight }) => api.post(`/exercises/${id}/weight`, { weight }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["userData"] }),
  });

  const handleBlur = (e, exerciseId) => {
    let value = e.target.value.replace("кг", "").trim();
    const weight = parseFloat(value);
    if (!isNaN(weight)) {
      mutation.mutate({ id: exerciseId, weight });
      e.target.value = `${weight}кг`;
    }
  };

  if (!nextData) return <div className={styles.empty}>Данные отсутствуют</div>;

  const { day, daysUntil } = nextData;
  const exercises = day.workout_exercises || [];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.planLabel}>ПЛАН: {plan.name}</div>
        
        <h2 className={styles.workoutTitle}>{day.name}</h2>
        
        <div className={styles.infoLine}>
          <span className={styles.dayBadge}>День {day.count_day}</span>
          <span className={styles.weekDay}>{day.week_day}</span>
          <span className={styles.status}>
            {daysUntil === 0 ? "Сегодня" : daysUntil === 1 ? "Завтра" : `Через ${daysUntil} дн.`}
          </span>
        </div>
      </header>
      
      <div className={styles.list}>
        {exercises.map((item, index) => (
          <div key={item.workout_exercise_id} className={styles.exerciseItem}>
            <div className={styles.left}>
              <span className={styles.index}>{index + 1}</span>
              <span className={styles.name}>{item.exercise?.name_exercise}</span>
            </div>
            
            <div className={styles.right}>
              <div className={styles.params}>
                {item.sets}  {item.repeats}
              </div>
              <input 
                type="text" 
                className={styles.weightInput} 
                defaultValue={item.weight ? `${item.weight}кг` : ""} 
                onFocus={(e) => e.target.value = e.target.value.replace("кг", "")}
                onBlur={(e) => handleBlur(e, item.workout_exercise_id)}
                onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}