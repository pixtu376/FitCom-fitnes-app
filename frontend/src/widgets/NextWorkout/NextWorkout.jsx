import styles from "./NextWorkout.module.css";

export default function NextWorkout() {
  const exercises = [
    { id: 1, name: "Приседания со штангой", sets: "4×8", weight: "80кг" },
    { id: 2, name: "Жим ногами в тренажере", sets: "4×8", weight: "80кг" },
    { id: 3, name: "Выпады", sets: "4×8", weight: "" },
    { id: 4, name: "Румынская тяга", sets: "4×8", weight: "" },
    { id: 5, name: "Разгибания ног в тренажере сидя", sets: "4×8", weight: "" },
    { id: 6, name: "Сгибания ног в тренажере", sets: "4×8", weight: "" },
    { id: 7, name: "Подъемы на носки стоя", sets: "4×8", weight: "" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        Через 2 дня <span className={styles.accent}>День ног</span>
      </div>
      <div className={styles.list}>
        {exercises.map(ex => (
          <div key={ex.id} className={styles.item}>
            <span className={styles.name}>{ex.id}. {ex.name}</span>
            <div className={styles.controls}>
              <button className={styles.addBtn}>+</button>
              <span className={styles.sets}>{ex.sets}</span>
              <input type="text" className={styles.input} defaultValue={ex.weight} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}