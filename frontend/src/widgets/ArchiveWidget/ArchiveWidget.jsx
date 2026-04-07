import React from 'react';
import api from "../../app/api";
import styles from '../../pages/Trainings/Training.module.css';

export default function ArchiveWidget({ plans = [], refetchPlans, currentPlanId, onSelectPlan }) {
    
    const handleFavorite = async (e, planId, currentStatus) => {
        e.stopPropagation();
        try {
            // Отправляем инвертированный статус
            await api.patch(`/plans/${planId}/favorite`, { is_favorite: !currentStatus });
            refetchPlans();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("Удалить этот план?")) return;
        try {
            await api.delete(`/plans/${id}`);
            refetchPlans();
        } catch (err) { console.error(err); }
    };

    return (
        <div className={styles.archiveList}>
            {plans.map((plan) => {
                const isActive = plan.plan_id === currentPlanId;
                
                return (
                    <div 
                        key={plan.plan_id}
                        className={`${styles.archiveItem} ${isActive ? styles.activeArchiveItem : ''}`}
                        onClick={() => onSelectPlan(plan.plan_id)}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                            <img src="/icons/calendar.svg" alt="" className={styles.iconSmall} />
                            <span style={{ fontSize: '14px' }}>{plan.name}</span>
                        </div>
                        
                        <div className={styles.archiveIcons}>
                            {/* Удаление */}
                            <img
                                src="/icons/trash.svg"
                                alt="del"
                                className={styles.iconSmall}
                                onClick={(e) => handleDelete(e, plan.plan_id)}
                            />
                            
                            {/* Избранное: меняем путь к файлу в зависимости от plan.is_favorite */}
                            <img 
                                src={plan.is_favorite ? "/icons/star-filled.svg" : "/icons/star.svg"} 
                                alt="fav" 
                                // Добавляем класс accentGreen если избранное, чтобы иконка подсветилась
                                className={`${styles.iconSmall} ${plan.is_favorite ? styles.accentGreen : ''}`}
                                onClick={(e) => handleFavorite(e, plan.plan_id, plan.is_favorite)}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}