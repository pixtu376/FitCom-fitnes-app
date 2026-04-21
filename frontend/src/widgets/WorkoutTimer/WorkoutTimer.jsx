import React, { useState, useEffect } from 'react';
import styles from './WorkoutTimer.module.css';

export default function WorkoutTimer({ isStarted, isPaused, isFinished, restTrigger, onPauseToggle, onReset }) {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [restSeconds, setRestSeconds] = useState(0);

  useEffect(() => {
    if (!isStarted) {
      setTotalSeconds(0);
      setRestSeconds(0);
    }
  }, [isStarted]);

  useEffect(() => {
    let interval = null;
    if (isStarted && !isPaused && !isFinished) {
      interval = setInterval(() => {
        setTotalSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStarted, isPaused, isFinished]);

  useEffect(() => {
    if (restTrigger > 0 && !isFinished) {
      setRestSeconds(45);
    }
  }, [restTrigger, isFinished]);

  useEffect(() => {
    let interval = null;
    if (restSeconds > 0 && !isPaused) {
      interval = setInterval(() => {
        setRestSeconds(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [restSeconds, isPaused]);

  const handleSkipRest = () => {
    setRestSeconds(0);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const secs = s % 60;
    return `${m.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.card}>
      <span className={styles.label}>ТАЙМЕР ТРЕНИРОВКИ</span>
      
      <div className={`${styles.mainTimer} ${isPaused ? styles.paused : ''}`}>
        {formatTime(totalSeconds)}
      </div>

      <hr className={styles.separator} />

      <div className={styles.restSection}>
        <div className={`${styles.progressCircle} ${restSeconds > 0 ? styles.active : ''}`}>
          <div className={styles.innerCircle}>
            {isPaused ? <span className={styles.pauseIcon}>||</span> : 'GO'}
          </div>
        </div>
        
        <div className={styles.restInfo}>
          <span className={styles.restLabel}>Время Отдыха</span>
          <span className={styles.restValue}>{formatTime(restSeconds)}</span>
        </div>
      </div>

      <div className={styles.controls}>
        <button className={styles.resetBtn} onClick={onReset} disabled={!isStarted}>
          Сброс
        </button>
        <button 
          className={styles.pauseBtn} 
          onClick={onPauseToggle} 
          disabled={!isStarted || isFinished}
        >
          {isPaused ? 'Продолжить' : 'Пауза'}
        </button>
      </div>
    </div>
  );
}