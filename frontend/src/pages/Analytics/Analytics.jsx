import React from "react";
import Sidebar from "../../widgets/Sidebar/Sidebar";
import styles from "./Analytics.module.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../app/api";
import { useState } from 'react';

import ProgressGallery from "../../widgets/ProgressGallery/ProgressGallery";
import MeasurementsPanel from "../../widgets/MeasurementsPanel/MeasurementsPanel";
import DynamicsChart from "../../widgets/DynamicsChart/DynamicsChart";
import KeyIndicators from "../../widgets/KeyIndicators/KeyIndicators";

export default function AnalyticsPage() {
  const queryClient = useQueryClient();

  // 1. Добавили refetch сюда (переименовали в refetchStats для ясности)
  const { 
    data: stats, 
    isLoading: statsLoading, 
    refetch: refetchStats 
  } = useQuery({
    queryKey: ["userStats"],
    queryFn: async () => {
      const response = await api.get("/user/view_stat");
      return response.data;
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { 
    data: photos, 
    isLoading: photosLoading, 
    refetch: refetchPhotos 
  } = useQuery({
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

  if (statsLoading || photosLoading) {
    return <div className={styles.layout}>Загрузка аналитики...</div>;
  }

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.contentGrid}>
          <div className={styles.leftCol}>
            <ProgressGallery 
              photos={photos || []} 
              onDelete={(id) => deletePhotoMutation.mutate(id)} 
              refetch={refetchPhotos}
            />
            {/* 2. Теперь передаем существующую функцию refetchStats */}
            <MeasurementsPanel 
              stats={stats} 
              refetch={refetchStats} 
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen} 
            />
          </div>

          <div className={styles.rightCol}>
            <DynamicsChart stats={stats || []} />
            <KeyIndicators stats={stats || []} />
          </div>
        </div>
      </main>
    </div>
  );
}