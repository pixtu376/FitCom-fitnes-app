import React, { useState, useEffect } from 'react';
import Sidebar from "../../widgets/Sidebar/Sidebar";
import MobileNav from "../../widgets/MobileNav/MobileNav";
import MobileHeader from "../../widgets/MobileHeader/MobileHeader";
import WorkoutTimer from '../../widgets/WorkoutTimer/WorkoutTimer';
import WaterTracker from '../../widgets/WaterTracker/WaterTracker';
import ActiveSession from '../../widgets/ActiveSession/ActiveSession';

import styles from './InGym.module.css';

export default function InGymPage() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [sessionKey, setSessionKey] = useState(0); 
  const [restTrigger, setRestTrigger] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1200);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      {!isMobile && (
        <div className={styles.sidebarDesktopWrapper}>
          <Sidebar />
        </div>
      )}
      
      <main className={styles.main}>
        {isMobile && <MobileHeader />}

        <div className={styles.contentGrid}>
          
          <div className={styles.leftCol}>
            <div className={styles.widgetsRow}>
              <div className={styles.timerCardWrapper}>
                <WorkoutTimer 
                  isStarted={isStarted} 
                  isPaused={isPaused}
                  isFinished={isFinished}
                  restTrigger={restTrigger}
                  onPauseToggle={() => setIsPaused(!isPaused)}
                  onReset={handleReset}
                  isMobile={isMobile}
                />
              </div>
              
              <div className={styles.waterCardWrapper}>
                <WaterTracker 
                  isStarted={isStarted} 
                  restTrigger={restTrigger}
                  resetTrigger={sessionKey}
                  isMobile={isMobile}
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

      {isMobile && <MobileNav />}
    </div>
  );
}