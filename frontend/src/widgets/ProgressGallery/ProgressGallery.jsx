import React, { useRef, useState } from 'react';
import api from "../../app/api";
import styles from './ProgressGallery.module.css';
import { FiTrash2, FiRefreshCw, FiCamera, FiLoader, FiMoreHorizontal } from 'react-icons/fi';

export default function ProgressGallery({ photos, onDelete, refetch }) {
  const fileInput = useRef(null);
  const [uploadType, setUploadType] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); 

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
      if (refetch) refetch();
    } catch (err) {
      console.error("Ошибка загрузки:", err.response?.data);
      alert("Не удалось загрузить фото. Попробуйте другой формат.");
    } finally {
      setIsUploading(false);
      setActiveMenu(null);
    }
  };

  const openUpload = (isBefore) => {
    if (isUploading) return;
    setUploadType(isBefore);
    fileInput.current.click();
  };

  const beforePhoto = photos?.find(p => p.is_before == 1);
  const afterPhoto = photos?.find(p => p.is_before == 0);

  const slots = [
    { 
      data: beforePhoto, 
      label: 'Точка старта', 
      type: true 
    },
    { 
      data: afterPhoto, 
      label: 'Текущий результат', 
      type: false 
    }
  ];

  return (
    <div className={`${styles.container} ${isUploading ? styles.loadingState : ''}`}>
      <div className={styles.header}>
        <h3 className={styles.cardTitle}>Галерея прогресса</h3>
        {isUploading && (
          <div className={styles.status}>
            <FiLoader className={styles.spin} />
            <span>Обновляем...</span>
          </div>
        )}
      </div>
      
      <input 
        type="file" 
        ref={fileInput} 
        hidden 
        accept="image/*" 
        onChange={handleFileChange} 
      />
      
      <div className={styles.grid}>
        {slots.map(slot => (
          <div key={slot.label} className={styles.photoBox}>
            {slot.data ? (
              <div className={styles.imgContainer}>
                <img src={slot.data.url} alt={slot.label} className={styles.image} />
                
                <div className={styles.photoControlOverlay}>
                  {activeMenu === slot.label ? (
                    <div className={styles.inlineMenu}>
                      <button 
                        onClick={() => openUpload(slot.type)} 
                        className={styles.menuActionBtn}
                        title="Заменить фото"
                      >
                        <FiRefreshCw />
                        <span>Заменить</span>
                      </button>
                      <button 
                        onClick={() => onDelete(slot.data.photo_id)} 
                        className={`${styles.menuActionBtn} ${styles.delMenuBtn}`}
                        title="Удалить"
                      >
                        <FiTrash2 />
                        <span>Удалить</span>
                      </button>
                    </div>
                  ) : (
                    <button 
                      className={styles.centralManageBtn}
                      onClick={() => setActiveMenu(slot.label)}
                      title="Управление фото"
                    >
                      <FiMoreHorizontal />
                    </button>
                  )}
                </div>

                <div className={styles.photoFooter}>
                  <span className={styles.labelTag}>{slot.label}</span>
                  <span className={styles.dateLabel}>
                    {new Date(slot.data.created_at).toLocaleDateString('ru-RU', { 
                      day: 'numeric', 
                      month: 'long' 
                    })}
                  </span>
                </div>
              </div>
            ) : (
              <div className={styles.placeholderTile} onClick={() => openUpload(slot.type)}>
                <div className={styles.iconCircle}>
                  <FiCamera className={styles.placeholderIcon} />
                </div>
                <span className={styles.placeholderText}>{slot.label}</span>
                <span className={styles.addHint}>Загрузить снимок</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}