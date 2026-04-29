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

const MOBILE_BREAKPOINT = 1200;

export default function AnalyticsPage() {
  const queryClient = useQueryClient();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { data: user, isLoading: userLoading, isError: userError } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const response = await api.get("/user");
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const { data: stats, isLoading: statsLoading, isError: statsError, refetch: refetchStats } = useQuery({
    queryKey: ["userStats"],
    queryFn: async () => {
      const response = await api.get("/user/view_stat");
      return response.data;
    }
  });

  const { data: photos, isLoading: photosLoading, isError: photosError, refetch: refetchPhotos } = useQuery({
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

  if (userLoading || statsLoading || photosLoading) {
    return <div className="app-loader">Загрузка аналитики...</div>;
  }

  if (userError || statsError || photosError) {
    return (
      <div className="app-error">
        <p>Ошибка при загрузке данных аналитики</p>
        <button onClick={() => { refetchStats(); refetchPhotos(); }} className="app-btn-retry">
          Повторить
        </button>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      {!isMobile && (
        <div className={styles.sidebarDesktopWrapper}>
          <Sidebar user={user} />
        </div>
      )}

      <main className={styles.main}>
        {isMobile && <MobileHeader user={user} />}

        <div className={styles.contentGrid}>
          <div className={styles.leftCol}>
            <div className={`${styles.card} ${styles.galleryCard}`}>
              <ProgressGallery 
                photos={photos || []} 
                onDelete={(id) => deletePhotoMutation.mutate(id)} 
                refetch={refetchPhotos}
              />
            </div>
            
            <div className={`${styles.card} ${styles.measurementsCard}`}>
              <MeasurementsPanel 
                stats={stats} 
                refetch={refetchStats} 
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen} 
              />
            </div>
          </div>

          <div className={styles.rightCol}>
            <div className={`${styles.card} ${styles.chartCard}`}>
              <h3 className={styles.cardTitle}>Динамика изменений</h3>
              <div className={styles.chartWrapper}>
                <DynamicsChart stats={stats || []} />
              </div>
            </div>

            <div className={`${styles.card} ${styles.indicatorsCard}`}>
              <KeyIndicators stats={stats || []} />
            </div>
          </div>
        </div>
      </main>

      {isMobile && <MobileNav />}
    </div>
  );
}