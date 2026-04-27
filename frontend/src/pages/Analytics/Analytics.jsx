import React, { useState, useEffect } from "react";
import Sidebar from "../../widgets/Sidebar/Sidebar";
import MobileNav from "../../widgets/MobileNav/MobileNav";
import MobileHeader from "../../widgets/MobileHeader/MobileHeader"; 
import styles from "./Analytics.module.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../app/api";

import ProgressGallery from "../../widgets/ProgressGallery/ProgressGallery";
import MeasurementsPanel from "../../widgets/MeasurementsPanel/MeasurementsPanel";
import DynamicsChart from "../../widgets/DynamicsChart/DynamicsChart";
import KeyIndicators from "../../widgets/KeyIndicators/KeyIndicators";

export default function AnalyticsPage() {
  const queryClient = useQueryClient();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);

  // Следим за размером экрана
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1200);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Получаем данные пользователя (для хедера и статистики)
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const response = await api.get("/user");
      return response.data;
    },
  });

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ["userStats"],
    queryFn: async () => {
      const response = await api.get("/user/view_stat");
      return response.data;
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: photos, isLoading: photosLoading, refetch: refetchPhotos } = useQuery({
    queryKey: ["userPhotos"],
    queryFn: async () => {
      const response = await api.get("/user/view_photo");
      return response.data;
    }
  });

  const deletePhotoMutation = useMutation({
    mutationFn: (id) => api.delete(`/user/photo/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["userPhotos"] }),
  });

  if (statsLoading || photosLoading || userLoading) return null;

  return (
    <div className={styles.layout}>
      {/* Десктопный сайдбар */}
      {!isMobile && (
        <div className={styles.sidebarDesktopWrapper}>
          <Sidebar user={user} />
        </div>
      )}

      <main className={styles.main}>
        {/* Мобильный хедер */}
        {isMobile && <MobileHeader user={user} />}

        <div className={styles.contentGrid}>
          {/* Левая колонка: Фото и Замеры */}
          <div className={styles.leftCol}>
            <div className={styles.card}>
               <ProgressGallery 
                photos={photos || []} 
                onDelete={(id) => deletePhotoMutation.mutate(id)} 
                refetch={refetchPhotos}
              />
            </div>
            
            <div className={styles.card}>
              <MeasurementsPanel 
                stats={stats} 
                refetch={refetchStats} 
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen} 
              />
            </div>
          </div>

          {/* Правая колонка: Графики и Индикаторы */}
          <div className={styles.rightCol}>
            <div className={`${styles.card} ${styles.chartCard}`}>
              <h3 className={styles.cardTitle}>Динамика изменений</h3>
              <div className={styles.chartWrapper}>
                <DynamicsChart stats={stats || []} />
              </div>
            </div>

            <div className={styles.card}>
              <KeyIndicators stats={stats || []} />
            </div>
          </div>
        </div>
      </main>

      {/* Мобильное меню */}
      {isMobile && <MobileNav />}
    </div>
  );
}