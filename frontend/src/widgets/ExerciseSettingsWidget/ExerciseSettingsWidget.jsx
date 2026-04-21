import React, { useState, useMemo, useEffect } from 'react';
import styles from "../../pages/Trainings/Training.module.css";
import api from "../../app/api";
import Icon from "../Icons/Icons"; 

export default function ExerciseSettingsWidget({ plan, activeDayId, setActiveDayId, refetchPlans }) {
  const [newExercise, setNewExercise] = useState("");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [dayNameInput, setDayNameInput] = useState("");

  const colors = ["#38A169", "#E53E3E", "#3182CE", "#D69E2E", "#805AD5", "#718096", "#FF8C00", "#008080"];
  
  const iconList = [
    "dumbbell", "boxing", "stretching", "biceps_stat", 
    "heart_biceps", "leaf_circle", "yoga", "run_shoe", "bodybuilder"
  ];
  
  const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  if (!plan) return <div>Загрузка плана...</div>;

  const sortedDays = useMemo(() => {
    return [...(plan.training_days || [])].sort((a, b) => {
      return weekDays.indexOf(a.week_day) - weekDays.indexOf(b.week_day);
    });
  }, [plan.training_days]);

  const activeDay = sortedDays.find(d => d.training_day_id === activeDayId) || sortedDays[0];
  
  const otherUsedDays = plan.training_days
    ?.filter(d => d.training_day_id !== activeDay?.training_day_id)
    .map(d => d.week_day) || [];

  useEffect(() => {
    if (activeDay && !isEditingName) {
      setDayNameInput(activeDay.name || "Тренировка");
    }
  }, [activeDay, isEditingName]);

  const handleUpdateDay = async (payload) => {
    try {
      await api.put(`/days/${activeDay.training_day_id}`, payload);
      setShowColorPicker(false);
      setShowIconPicker(false);
      refetchPlans();
    } catch (e) { console.error(e); }
  };

  const handleSaveName = () => {
    setIsEditingName(false);
    if (dayNameInput.trim() !== activeDay.name) {
      handleUpdateDay({ name: dayNameInput.trim() || "Тренировка" });
    }
  };

  const handleAddDay = async () => {
    const allUsed = plan.training_days?.map(d => d.week_day) || [];
    const nextWeekDay = weekDays.find(d => !allUsed.includes(d));
    if (!nextWeekDay) return;

    try {
      await api.post(`/plans/${plan.plan_id}/days`, {
        name: "Новая тренировка",
        week_day: nextWeekDay,
        count_day: plan.training_days.length + 1,
        icon: "dumbbell",
        color: "#38A169"
      });
      refetchPlans();
    } catch (e) { console.error(e); }
  };

  return (
    <div className={styles.card}>
      <div className={styles.settingsHeader}>
        <div>
          <h2 className={styles.cardTitle} style={{ marginBottom: '4px' }}>Настройка упражнений</h2>
          <p className={styles.subtitle}>Программа: <span className={styles.accentGreen}>“{plan.name}”</span></p>
        </div>

        <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
          <button className={styles.btn} onClick={() => { setShowColorPicker(!showColorPicker); setShowIconPicker(false); }}>
            <div style={{ backgroundColor: activeDay?.color, width: 18, height: 18, borderRadius: '50%' }} />
          </button>
          
          <button className={styles.btn} onClick={() => { setShowIconPicker(!showIconPicker); setShowColorPicker(false); }}>
            <Icon name={activeDay?.icon || 'dumbbell'} color={activeDay?.color || "#fff"} size={20} />
          </button>

          {showColorPicker && (
            <div style={{ position: 'absolute', top: '48px', right: '40px', background: '#22252A', padding: '12px', borderRadius: '12px', display: 'flex', gap: '8px', zIndex: 10, border: '1px solid rgba(255,255,255,0.1)' }}>
              {colors.map(c => (
                <div key={c} onClick={() => handleUpdateDay({ color: c })} style={{ width: 24, height: 24, background: c, borderRadius: '6px', cursor: 'pointer' }} />
              ))}
            </div>
          )}

          {showIconPicker && (
            <div style={{ 
              position: 'absolute', top: '48px', right: 0, 
              background: '#22252A', padding: '16px', borderRadius: '12px', 
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: '12px', zIndex: 10, border: '1px solid rgba(255,255,255,0.1)' 
            }}>
              {iconList.map(i => (
                <div 
                  key={i} 
                  onClick={() => handleUpdateDay({ icon: i })} 
                  style={{ 
                    cursor: 'pointer', 
                    width: '40px',
                    height: '40px', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    background: activeDay.icon === i ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)', 
                    borderRadius: '50%',
                    border: activeDay.icon === i ? `1.5px solid ${activeDay.color}` : '1.5px solid transparent',
                    padding: '6px',
                    boxSizing: 'border-box'
                  }}
                >
                  <Icon 
                    name={i} 
                    color={activeDay.icon === i ? activeDay.color : "#fff"} 
                    size="100%"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.tabs}>
        {sortedDays.map(day => (
          <button 
            key={day.training_day_id}
            className={`${styles.tabBtn} ${activeDayId === day.training_day_id ? styles.active : ''}`}
            onClick={() => setActiveDayId(day.training_day_id)}
            style={activeDayId === day.training_day_id ? { borderBottom: `2px solid ${day.color}` } : {}}
          >
            <Icon 
              name={day.icon} 
              color={activeDayId === day.training_day_id ? day.color : "#64748B"} 
              size={24} 
            />
            <span>{day.week_day}</span>
          </button>
        ))}
        {plan.training_days?.length < 7 && (
          <button className={styles.tabBtn} onClick={handleAddDay} style={{ justifyContent: 'center', fontSize: '24px', opacity: 0.5 }}>+</button>
        )}
      </div>

      {activeDay && (
        <>
          <div className={styles.dayHeaderBar}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <select 
                  value={activeDay.week_day} 
                  onChange={(e) => handleUpdateDay({ week_day: e.target.value })}
                  style={{ 
                    background: '#1A1D21', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '6px',
                    color: activeDay.color || '#fff', 
                    padding: '4px 28px 4px 10px',
                    fontSize: '14px', 
                    fontWeight: '600', 
                    appearance: 'none',
                    outline: 'none', 
                    cursor: 'pointer' 
                  }}
                >
                  {weekDays.map(d => (
                    (!otherUsedDays.includes(d) || d === activeDay.week_day) && (
                      <option key={d} value={d} style={{ background: '#22252A', color: '#fff' }}>{d}</option>
                    )
                  ))}
                </select>
                <div style={{ position: 'absolute', right: '10px', pointerEvents: 'none', width: '0', height: '0', borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: `5px solid ${activeDay.color || '#94A3B8'}` }}></div>
              </div>

              <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>

              {isEditingName ? (
                <input
                  autoFocus
                  value={dayNameInput}
                  onChange={(e) => setDayNameInput(e.target.value)}
                  onBlur={handleSaveName}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  style={{
                    background: '#1A1D21',
                    border: `1px solid ${activeDay.color}`,
                    color: '#FFFFFF',
                    fontSize: '15px',
                    fontWeight: '500',
                    outline: 'none',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    width: '180px'
                  }}
                />
              ) : (
                <div 
                  onClick={() => setIsEditingName(true)}
                  style={{ fontSize: '15px', cursor: 'pointer', color: '#E2E8F0', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {activeDay.name || "Название тренировки"}
                  <Icon name="pencil" color="rgba(255,255,255,0.3)" size={12} />
                </div>
              )}
            </div>

            <span className={styles.deleteDayText} onClick={() => { if(window.confirm("Удалить день?")) api.delete(`/days/${activeDay.training_day_id}`).then(() => { setActiveDayId(null); refetchPlans(); }) }}>
                Удалить день
            </span>
          </div>

          <div className={styles.exerciseList}>
            {activeDay.workout_exercises?.map((we, index) => (
              <div key={we.workout_exercise_id} className={styles.exerciseRow}>
                <span style={{ color: '#E2E8F0' }}>{index + 1}. {we.exercise.name_exercise}</span>
                <div className={styles.editBadge}>{we.repeats}x</div>
                <div className={styles.editBadge}>{we.weight}кг</div>
                <button 
                  onClick={() => { if(window.confirm("Удалить?")) api.delete(`/exercises/${we.workout_exercise_id}`).then(refetchPlans); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                >
                  <Icon name="minus_circle" color="#E53E3E" size={18} />
                </button>
              </div>
            ))}

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <input 
                type="text" 
                placeholder="Новое упражнение" 
                className={styles.newExerciseInput}
                value={newExercise}
                onChange={(e) => setNewExercise(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && api.post(`/exercises/${activeDay.training_day_id}/add`, { name: newExercise }).then(() => {setNewExercise(""); refetchPlans();})}
              />
              <button className={styles.btn} onClick={() => api.post(`/exercises/${activeDay.training_day_id}/add`, { name: newExercise }).then(() => {setNewExercise(""); refetchPlans();})}>
                 +
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}