import React, { useState, useEffect, useRef } from 'react';
import api from '../../app/api';
import styles from './ActiveSession.module.css';

export default function ActiveSession({ onStart, onStepComplete, onFinish }) {
  const [sessionState, setSessionState] = useState('loading');
  const [trainingMode, setTrainingMode] = useState('planned'); 
  const [plan, setPlan] = useState(null);
  const [activeDay, setActiveDay] = useState(null);
  const [exerciseLogs, setExerciseLogs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemRefs = useRef([]);

  useEffect(() => {
    fetchActivePlan();
  }, []);

  useEffect(() => {
    if (sessionState === 'active' && itemRefs.current[currentIndex]) {
      itemRefs.current[currentIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentIndex, sessionState]);

  const fetchActivePlan = async () => {
    try {
      const res = await api.get('/user/view_plans');
      const plans = res.data;
      const activePlan = plans.find(p => p.is_active === 1) || plans[0];
      setPlan(activePlan);

      if (activePlan && activePlan.training_days) {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayName = daysOfWeek[new Date().getDay()];
        const todayPlan = activePlan.training_days.find(d => d.week_day === todayName);

        if (todayPlan) {
          setActiveDay(todayPlan);
          setTrainingMode('planned');
          initLogs(todayPlan);
          setSessionState('ready');
        } else {
          setActiveDay(activePlan.training_days[0]);
          initLogs(activePlan.training_days[0]);
          setSessionState('selection');
        }
      } else {
        setSessionState('error');
      }
    } catch (e) {
      setSessionState('error');
    }
  };

  const initLogs = (day) => {
    if (day && day.workout_exercises) {
      const initialLogs = day.workout_exercises.map(ex => ({
        id: ex.workout_exercise_id,
        name: ex.exercise.name_exercise,
        status: 'pending', 
        target_reps: ex.repeats,
        weight: ex.weight
      }));
      setExerciseLogs(initialLogs);
      itemRefs.current = new Array(initialLogs.length).fill(null);
    }
  };

  const handleStartWorkout = () => {
    setSessionState('active');
    if (onStart) onStart(); 
  };

  const handleAction = (status) => {
    const newLogs = [...exerciseLogs];
    newLogs[currentIndex].status = status;
    setExerciseLogs(newLogs);

    if (onStepComplete) onStepComplete();

    if (currentIndex < exerciseLogs.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setSessionState('finished');
      if (onFinish) onFinish(); 
    }
  };

  const handleUndo = () => {
    const isFinished = sessionState === 'finished';
    const targetIndex = isFinished ? exerciseLogs.length - 1 : currentIndex - 1;
    
    if (targetIndex >= 0) {
      const newLogs = [...exerciseLogs];
      newLogs[targetIndex].status = 'pending';
      setExerciseLogs(newLogs);
      setCurrentIndex(targetIndex);
      
      if (isFinished && onStart) {
        onStart();
      }
      setSessionState('active');
    }
  };

  const submitReport = async () => {
    try {
      await api.post('/gym/save-log', {
        training_day_id: activeDay.training_day_id,
        session_mode: trainingMode, 
        exercises: exerciseLogs.map(log => ({
          name: log.name,
          status: log.status,
          target_reps: log.target_reps,
          weight: log.weight
        }))
      });
      alert("Отчёт успешно сохранён!");
    } catch (e) {
      alert("Ошибка при сохранении.");
    }
  };

  if (sessionState === 'loading') return <div className={styles.card}>Загрузка данных...</div>;
  if (sessionState === 'error' || !activeDay) return <div className={styles.card}>Нет активного плана</div>;

  if (sessionState === 'selection') {
    return (
      <div className={`${styles.card} ${styles.centerCard}`}>
        <h3 className={styles.selectionTitle}>Сегодня день отдыха</h3>
        <p className={styles.selectionText}>Выполнить тренировку <span className={styles.accent}>"{activeDay.name}"</span>?</p>
        <div className={styles.selectionBtns}>
          <button className={styles.primaryBtn} onClick={() => {setTrainingMode('replace'); setSessionState('ready');}}>
            С замещением дня
          </button>
          <button className={styles.secondaryBtn} onClick={() => {setTrainingMode('extra'); setSessionState('ready');}}>
            Для себя
          </button>
        </div>
      </div>
    );
  }

  if (sessionState === 'ready') {
    return (
      <div className={`${styles.card} ${styles.centerCard}`}>
        <span className={styles.subtitle}>ПРОГРАММА: "{plan?.name}"</span>
        <h2 className={styles.selectionTitle}>{activeDay.name}</h2>
        <p className={styles.selectionText}>{exerciseLogs.length} упражнений</p>
        <button className={styles.startBtn} onClick={handleStartWorkout}>
          НАЧАТЬ ТРЕНИРОВКУ
        </button>
      </div>
    );
  }

  const completedCount = exerciseLogs.filter(ex => ex.status !== 'pending').length;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.subtitle}>
          {trainingMode === 'replace' ? 'Замещение дня:' : trainingMode === 'extra' ? 'Вне плана:' : 'Текущая сессия:'}
        </span>
        <h2 className={styles.title}>
          <span className={styles.accent}>"{activeDay.name}"</span>
        </h2>
      </div>

      <div className={styles.list}>
        {exerciseLogs.map((ex, idx) => (
          <div 
            key={ex.id} 
            ref={el => itemRefs.current[idx] = el}
            className={`
              ${styles.item} 
              ${idx === currentIndex && sessionState !== 'finished' ? styles.activeItem : ''} 
              ${ex.status !== 'pending' ? styles.doneItem : ''}
            `}
          >
            <div className={styles.exInfo}>
              <span className={styles.exName}>{idx + 1}) {ex.name}</span>
            </div>
            <div className={styles.exMeta}>
              <span>{ex.target_reps} повт. / {ex.weight} кг</span>
              <div className={`${styles.badge} ${styles[ex.status]}`}>
                {ex.status === 'checked' ? 'Чек' : ex.status === 'skipped' ? 'Пропуск' : 'Ждет'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.stats}>Прогресс: {completedCount}/{exerciseLogs.length}</div>

        <div className={styles.actions}>
          {sessionState === 'active' ? (
            <>
              <button className={styles.actionBtn} onClick={() => handleAction('checked')}>ВЫПОЛНИТЬ</button>
              <button className={styles.skipBtn} onClick={() => handleAction('skipped')}>ПРОПУСК</button>
              <button className={styles.undoBtn} onClick={handleUndo} disabled={currentIndex === 0}>НАЗАД</button>
            </>
          ) : (
            <>
              <button className={styles.undoBtn} onClick={handleUndo}>ИСПРАВИТЬ</button>
              <button className={styles.submitBtn} onClick={submitReport}>ОТПРАВИТЬ ОТЧЕТ</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}