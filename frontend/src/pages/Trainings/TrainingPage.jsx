import React, { useState, useEffect } from "react";
import Sidebar from "../../widgets/Sidebar/Sidebar";
import MobileHeader from "../../widgets/MobileHeader/MobileHeader";
import MobileNav from "../../widgets/MobileNav/MobileNav";
import WeeklyPlanWidget from "../../widgets/WeeklyPlanWidget/WeeklyPlanWidget";
import PlanManagerWidget from "../../widgets/PlanManagerWidget/PlanManagerWidget";
import ArchiveWidget from "../../widgets/ArchiveWidget/ArchiveWidget";
import ExerciseSettingsWidget from "../../widgets/ExerciseSettingsWidget/ExerciseSettingsWidget";
import CreatePlanModal from "../../widgets/CreatePlanModal/CreatePlanModal";
import styles from "./Training.module.css";
import { useQuery } from "@tanstack/react-query";
import api from "../../app/api";

export default function TrainingPage() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);
  const [activeDayId, setActiveDayId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1200);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { data: plans, isLoading, refetch } = useQuery({
    queryKey: ["trainingPlans"],
    queryFn: async () => {
      const response = await api.get("/user/view_plans");
      return response.data;
    }
  });

  const currentPlan = plans?.find(p => p.plan_id === selectedPlanId) || 
                      plans?.find(p => String(p.is_active) === "1") || 
                      plans?.[0];

  useEffect(() => {
    if (currentPlan?.training_days?.length > 0) {
      const todayName = new Intl.DateTimeFormat('ru-RU', { weekday: 'short' })
        .format(new Date())
        .replace('.', '');
      
      const todayDay = currentPlan.training_days.find(d => 
        d.week_day && d.week_day.toLowerCase() === todayName.toLowerCase()
      );

      setActiveDayId(todayDay ? todayDay.training_day_id : currentPlan.training_days[0].training_day_id);
    }
  }, [currentPlan?.plan_id]);

  const handleSelectPlan = async (planId) => {
    try {
      await api.post(`/plans/${planId}/activate`);
      setSelectedPlanId(planId);
      await refetch();
    } catch (err) {
      console.error("Ошибка при активации плана:", err);
    }
  };

  if (isLoading) return null;
  return (
    <div className={styles.layout}>
      {!isMobile && <Sidebar />}

      <main className={styles.main}>
        {isMobile && <MobileHeader user={null} />}

        <section className={styles.topSection}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Еженедельный план: {currentPlan?.name}</h3>
            <WeeklyPlanWidget days={currentPlan?.training_days || []} isMobile={isMobile} />
          </div>
        </section>

        <div className={styles.contentGrid}>
          <div className={styles.leftCol}>
            <div className={styles.adaptiveManagerWrapper}>
              <div className={`${styles.card} ${styles.managementCard}`}>
                <h3 className={styles.cardTitle}>Управление</h3>
                <PlanManagerWidget refetchPlans={refetch} onOpenCreate={() => setIsModalOpen(true)} />
              </div>
              
              <div className={`${styles.card} ${styles.archiveCard}`}>
                <h3 className={styles.cardTitle}>Архив</h3>
                <div className={styles.archiveList}>
                   <ArchiveWidget 
                    plans={plans || []} 
                    refetchPlans={refetch} 
                    currentPlanId={currentPlan?.plan_id} 
                    onSelectPlan={handleSelectPlan} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.rightCol}>
            <div className={`${styles.card} ${styles.exercisesCard}`}>
              <ExerciseSettingsWidget 
                plan={currentPlan} 
                activeDayId={activeDayId} 
                setActiveDayId={setActiveDayId} 
                refetchPlans={refetch} 
              />
            </div>
          </div>
        </div>
      </main>

      {isMobile && <MobileNav />}
      {isModalOpen && <CreatePlanModal onClose={() => setIsModalOpen(false)} refetchPlans={refetch} />}
    </div>
  );
}