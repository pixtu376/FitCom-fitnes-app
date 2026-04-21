import React, { useState } from 'react';
import Sidebar from "../../widgets/Sidebar/Sidebar";
import WorkoutTimer from '../../widgets/WorkoutTimer/WorkoutTimer';
import WaterTracker from '../../widgets/WaterTracker/WaterTracker';
import ActiveSession from '../../widgets/ActiveSession/ActiveSession';

import styles from './InGym.module.css';

export default function InGymPage() {
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [sessionKey, setSessionKey] = useState(0); 
  const [restTrigger, setRestTrigger] = useState(0); 

  const handleStart = () => {
    setIsStarted(true);
    setIsPaused(false);
    setIsFinished(false);
  };

  const handleStep = () => {
    setRestTrigger(prev => prev + 1); 
  };

  const handleFinish = () => {
    setIsFinished(true);
  };

  const handleReset = () => {
    if (window.confirm("Сбросить текущий прогресс?")) {
      setIsStarted(false);
      setIsPaused(false);
      setIsFinished(false);
      setRestTrigger(0);
      setSessionKey(prev => prev + 1);
    }
  };

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.contentGrid}>
          
          <div className={styles.leftCol}>
            <div className={styles.card}>
              <WorkoutTimer 
                isStarted={isStarted} 
                isPaused={isPaused}
                isFinished={isFinished}
                restTrigger={restTrigger}
                onPauseToggle={() => setIsPaused(!isPaused)}
                onReset={handleReset}
              />
            </div>
            
            <div className={styles.waterCardWrapper}>
            <div className={styles.card}>
              <WaterTracker 
                isStarted={isStarted} 
                restTrigger={restTrigger}
                resetTrigger={sessionKey}
              />
              </div>
            </div>
            </div>


          <div className={styles.rightCol}>
            <div className={styles.sessionWrapper}>
              <ActiveSession 
                key={sessionKey}
                onStart={handleStart} 
                onStepComplete={handleStep} 
                onFinish={handleFinish}
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}