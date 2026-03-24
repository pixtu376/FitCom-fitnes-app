import styles from "./NextWorkout.module.css";
import api from "../../app/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function NextWorkout({ plan }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, weight }) => {
      return api.post(`/exercises/${id}/weight`, { weight });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
    onError: (error) => {
      console.error("Ошибка при сохранении веса:", error);
    }
  });

  const handleBlur = (e, exerciseId) => {
    const value = e.target.value.replace("кг", "").trim();
    if (!value) return;

    const weight = parseFloat(value);
    if (!isNaN(weight)) {
      mutation.mutate({ id: exerciseId, weight });
    }
  };

  if (!plan || !plan.training_days?.[0]) {
    return (
      <div className={styles.container}>
        <div className={styles.info}>Тренировок пока не запланировано</div>
      </div>
    );
  }

  const currentDay = plan.training_days[0];
  const exercises = currentDay.workout_exercises || [];

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        Ближайшая: <span className={styles.accent}>{plan.name || "Тренировка"}</span>
        <div className={styles.daySub}>День: {currentDay.day_name}</div>
      </div>
      
      <div className={styles.list}>
        {exercises.map((item, index) => (
          <div key={item.workout_exercise_id} className={styles.item}>
            <span className={styles.name}>
              {index + 1}. {item.exercise?.name_exercise || "Упражнение"} 
            </span>
            
            <div className={styles.controls}>
              <button className={styles.addBtn}>+</button>
              <span className={styles.sets}>
                {item.sets ? `${item.sets}×` : ""}{item.repeats || 0}
              </span>
              <input 
                type="text" 
                className={styles.input} 
                defaultValue={item.weight ? `${item.weight}кг` : ""} 
                placeholder="--"
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