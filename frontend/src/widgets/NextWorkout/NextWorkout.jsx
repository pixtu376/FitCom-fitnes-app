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
      alert("Не удалось сохранить вес");
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

  if (!plan) {
    return (
      <div className={styles.container}>
        <div className={styles.info}>Планов на сегодня нет</div>
      </div>
    );
  }

  const exercises = plan.exercises || [];

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        Ближайшая: <span className={styles.accent}>{plan.name || "Тренировка"}</span>
      </div>
      
      <div className={styles.list}>
        {exercises.map((ex, index) => (
          <div key={ex.id || index} className={styles.item}>
            <span className={styles.name}>
              {index + 1}. {ex.name} 
            </span>
            
            <div className={styles.controls}>
              <button className={styles.addBtn}>+</button>
              <span className={styles.sets}>
                {ex.sets ? `${ex.sets}×` : ""}{ex.reps}
              </span>
              <input 
                type="text" 
                className={styles.input} 
                defaultValue={ex.weight ? `${ex.weight}кг` : ""} 
                placeholder="--"
                onBlur={(e) => handleBlur(e, ex.id)} 
                onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}