import styles from "./Calendar.module.css";

export default function Calendar() {
  const days = [
    { d: 29, current: false }, { d: 30, current: false }, { d: 31, current: false },
    { d: 1, current: true }, { d: 2, current: true, active: true }, { d: 3, current: true }, { d: 4, current: true },
    { d: 5, current: true, active: true }, { d: 6, current: true }, { d: 7, current: true, active: true }, 
    { d: 8, current: true }, { d: 9, current: true, active: true }, { d: 10, current: true }, { d: 11, current: true },
    { d: 12, current: true, active: true }, { d: 13, current: true }, { d: 14, current: true, active: true },
    { d: 15, current: true }, { d: 16, current: true, active: true }, { d: 17, current: true }, { d: 18, current: true },
    { d: 19, current: true, active: true }, { d: 20, current: true }, { d: 21, current: true, active: true },
    { d: 22, current: true }, { d: 23, current: true, active: true }, { d: 24, current: true }, { d: 25, current: true },
    { d: 26, current: true, active: true }, { d: 27, current: true }, { d: 28, current: true, active: true },
    { d: 29, current: true }, { d: 30, current: true, active: true }, { d: 31, current: true }, { d: 1, current: false }
  ];

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <span className={styles.arrow}>&lt;</span>
        <span className={styles.month}>Январь</span>
        <span className={styles.arrow}>&gt;</span>
      </div>
      <div className={styles.weekDays}>
        {['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'].map(day => (
          <div key={day} className={styles.weekDay}>{day}</div>
        ))}
      </div>
      <div className={styles.grid}>
        {days.map((day, i) => (
          <div 
            key={i} 
            className={`${styles.day} ${!day.current ? styles.otherMonth : ''} ${day.active ? styles.active : ''}`}
          >
            {day.d}
          </div>
        ))}
      </div>
    </div>
  );
}