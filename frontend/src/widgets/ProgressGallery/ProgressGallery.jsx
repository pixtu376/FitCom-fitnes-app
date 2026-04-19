import React, { useRef, useState } from 'react';
import api from "../../app/api";
import styles from './ProgressGallery.module.css';
import { FiPlus, FiTrash2, FiRefreshCw, FiCamera } from 'react-icons/fi';

export default function ProgressGallery({ photos, onDelete, refetch }) {
  const fileInput = useRef(null);
  const [uploadType, setUploadType] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('is_before', uploadType ? 1 : 0);

    setIsUploading(true);
    try {
      await api.post('/user/add_photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      e.target.value = ''; 
      if (refetch) refetch(); // Теперь это сработает
    } catch (err) {
      console.error("Ошибка загрузки:", err.response?.data);
    } finally {
      setIsUploading(false);
    }
  };

  const openUpload = (isBefore) => {
    setUploadType(isBefore);
    fileInput.current.click();
  };

  const beforePhoto = photos?.find(p => p.is_before == 1);
  const afterPhoto = photos?.find(p => p.is_before == 0);

  const slots = [
    { data: beforePhoto, label: 'Фото ДО', type: true },
    { data: afterPhoto, label: 'Фото ПОСЛЕ', type: false }
  ];

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Галерея прогресса</h3>
      <input type="file" ref={fileInput} hidden accept="image/*" onChange={handleFileChange} />
      
      <div className={styles.grid}>
        {slots.map(slot => (
          <div key={slot.label} className={styles.photoBox}>
            {slot.data ? (
              <div className={styles.imgContainer}>
                <img src={slot.data.url} alt={slot.label} className={styles.image} />
                <div className={styles.overlay}>
                  <div className={styles.actions}>
                    {/* КНОПКА ОБНОВЛЕНИЯ */}
                    <button 
                      onClick={() => openUpload(slot.type)} 
                      className={styles.actionBtn} 
                      title="Заменить"
                    >
                      <FiRefreshCw />
                    </button>
                    {/* КНОПКА УДАЛЕНИЯ */}
                    <button 
                      onClick={() => onDelete(slot.data.photo_id)} // Используем пропс из AnalyticsPage
                      className={`${styles.actionBtn} ${styles.delBtn}`}
                      title="Удалить"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                  <span className={styles.dateLabel}>
                    {new Date(slot.data.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ) : (
              <div className={styles.placeholder} onClick={() => openUpload(slot.type)}>
                <div className={styles.placeholderContent}>
                  <FiCamera size={32} />
                  <span>{slot.label}</span>
                  <button className={styles.addBtn}>Добавить</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}