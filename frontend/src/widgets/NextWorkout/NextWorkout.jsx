import React, { useMemo, useCallback, useState } from "react";
import styles from "./NextWorkout.module.css";
import api from "../../app/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function NextWorkout({ plan }) {
  const queryClient = useQueryClient();
  const [savingId, setSavingId] = useState(null);

  const nextData = useMemo(() => {
    if (!plan?.training_days?.length) return null;

    const daysMap = { "Пн": 1, "Вт": 2, "Ср": 3, "Чт": 4, "Пт": 5, "Сб": 6, "Вс": 0 };
    const now = new Date();
    const currentDayIdx = now.getDay();

    let closestDay = null;
    let daysUntil = 8;

    for (const day of plan.training_days) {
      const targetIdx = daysMap[day.week_day?.trim()];
      if (targetIdx === undefined) continue;
      
      let diff = targetIdx - currentDayIdx;
      if (diff < 0) diff += 7;
      
      if (diff < daysUntil) {
        daysUntil = diff;
        closestDay = day;
      }
    }

    return closestDay ? { day: closestDay, daysUntil } : null;
  }, [plan]);

  const mutation = useMutation({
    mutationFn: ({ id, weight }) => api.post(`/exercises/${id}/weight`, { weight }),
    onMutate: ({ id }) => setSavingId(id),
    onSettled: () => setSavingId(null),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["userData"] }),
  });

  const handleSaveWeight = useCallback((e, exerciseId) => {
    const rawValue = e.target.value.replace("кг", "").trim();
    const weight = parseFloat(rawValue);
    if (!isNaN(weight) && weight > 0) {
      mutation.mutate({ id: exerciseId, weight });
    }
  }, [mutation]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") e.target.blur();
  }, []);

  if (!nextData) return <div className={styles.empty}>Тренировки не запланированы</div>;

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
        {exercises.length > 0 ? exercises.map((item, index) => (
          <div key={item.workout_exercise_id || index} className={styles.exerciseItem}>
            <div className={styles.left}>
              <span className={styles.index}>{index + 1}</span>
              <span className={styles.name}>{item.exercise?.name_exercise || "Упражнение"}</span>
            </div>
            
            <div className={styles.right}>
              <div className={styles.params}>
                {item.sets} × {item.repeats}
              </div>
              <input 
                type="text"
                inputMode="numeric"
                className={styles.weightInput} 
                defaultValue={item.weight ? `${item.weight}кг` : ""} 
                onFocus={(e) => e.target.value = e.target.value.replace("кг", "")}
                onBlur={(e) => handleSaveWeight(e, item.workout_exercise_id)}
                onKeyDown={handleKeyDown}
                disabled={savingId === item.workout_exercise_id}
              />
            </div>
          </div>
        )) : (
          <div className={styles.empty}>Нет упражнений</div>
        )}
      </div>
    </div>
  );
}