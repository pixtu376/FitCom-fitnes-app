import React, { useState, useEffect } from "react";
import Sidebar from "../../widgets/Sidebar/Sidebar";
import styles from "./Training.module.css";
import { useQuery } from "@tanstack/react-query";
import api from "../../app/api";

import WeeklyPlanWidget from "../../widgets/WeeklyPlanWidget/WeeklyPlanWidget";
import PlanManagerWidget from "../../widgets/PlanManagerWidget/PlanManagerWidget";
import ArchiveWidget from "../../widgets/ArchiveWidget/ArchiveWidget";
import ExerciseSettingsWidget from "../../widgets/ExerciseSettingsWidget/ExerciseSettingsWidget";
import CreatePlanModal from "../../widgets/CreatePlanModal/CreatePlanModal";

export default function TrainingPage() {
  const [activeDayId, setActiveDayId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  const { data: plans, isLoading, refetch } = useQuery({
    queryKey: ["trainingPlans"],
    queryFn: async () => {
      const response = await api.get("/user/view_plans");
      return response.data;
    }
  });

  const currentPlan = plans?.find(p => p.plan_id === selectedPlanId) 
                   || plans?.find(p => p.is_active) 
                   || plans?.[0];

useEffect(() => {
  if (currentPlan?.training_days?.length > 0) {
    const todayName = new Intl.DateTimeFormat('ru-RU', { weekday: 'short' })
      .format(new Date())
      .replace('.', '');

    const todayDay = currentPlan.training_days.find(d => 
      d.week_day &&
      d.week_day.toLowerCase() === todayName.toLowerCase()
    );

    if (todayDay) {
      setActiveDayId(todayDay.training_day_id);
    } else {
      setActiveDayId(currentPlan.training_days[0].training_day_id);
    }
  }
}, [currentPlan?.plan_id]);

  const handleSelectPlan = async (planId) => {
    const selected = plans.find(p => p.plan_id === planId);
    if (!selected) return;

    const today = new Date().setHours(0,0,0,0);
    const planEndDate = new Date(selected.end_date).setHours(0,0,0,0);

    // Если план просрочен
    if (planEndDate < today) {
      if (window.confirm("План истёк. Перенести на сегодня и сделать активным?")) {
        try {
          await api.post(`/plans/${planId}/activate`);
          await refetch();
          setSelectedPlanId(planId);
          return;
        } catch (err) { console.error(err); }
      }
    }

    try {
        await api.post(`/plans/${planId}/activate`);
        setSelectedPlanId(planId);
        await refetch();
    } catch (err) { console.error(err); }
  };

  if (isLoading) return <div className={styles.layout}>Загрузка...</div>;

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Еженедельный план: {currentPlan?.name}</h3>
          <WeeklyPlanWidget days={currentPlan?.training_days || []} />
        </div>
        
        <div className={styles.contentGrid}>
          <div className={styles.leftCol}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Управление</h3>
              <PlanManagerWidget refetchPlans={refetch} onOpenCreate={() => setIsModalOpen(true)} />
            </div>
            
            <div className={`${styles.card} ${styles.archiveCard}`}>
              <h3 className={styles.cardTitle}>Архив</h3>
              <ArchiveWidget 
                plans={plans || []} 
                refetchPlans={refetch}
                currentPlanId={currentPlan?.plan_id}
                onSelectPlan={handleSelectPlan} 
              />
            </div>
          </div>

          <div className={styles.rightCol}>
            <div className={styles.card} style={{ flex: 1 }}>
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
      {isModalOpen && <CreatePlanModal onClose={() => setIsModalOpen(false)} refetchPlans={refetch} />}
    </div>
  );
}