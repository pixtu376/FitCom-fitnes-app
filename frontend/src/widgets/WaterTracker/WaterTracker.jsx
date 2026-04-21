import React, { useState, useEffect } from 'react';
import styles from './WaterTracker.module.css';

export default function WaterTracker({ isStarted, restTrigger, resetTrigger }) {
  const [percent, setPercent] = useState(40);

  useEffect(() => {
    setPercent(40);
  }, [resetTrigger]);

  useEffect(() => {
    if (isStarted && restTrigger > 0) {
      setPercent(prev => Math.max(prev - 7, 0));
    }
  }, [restTrigger, isStarted]);

  const handleAddWater = (amount) => {
    setPercent(prev => Math.min(prev + amount, 100));
  };

  return (
    <div className={styles.card}>
      <span className={styles.label}>Контроль воды</span>
      
      <div className={styles.content}>
        <div className={styles.bottleContainer}>
          <div className={styles.cap}></div>
          <div className={styles.bottleBody}>
            <div 
              className={styles.water} 
              style={{ height: `${percent}%` }} 
            />
            <div className={styles.marks}>
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.percentText}>{percent}%</div>
          <p className={styles.hint}>Самое время сделать несколько глотков</p>
          
          <div className={styles.progressTrack}>
            <div 
              className={styles.progressBar} 
              style={{ 
                width: `${percent}%`,
              }} 
            />
          </div>

          <div className={styles.controls}>
            <button onClick={() => handleAddWater(10)}>+ 100 мл</button>
            <button onClick={() => handleAddWater(25)}>+ 250 мл</button>
            <button onClick={() => handleAddWater(50)}>+ 500 мл</button>
          </div>
        </div>
      </div>
    </div>
  );
}