import React, { useState, useMemo } from 'react';
import api from "../../app/api";
import styles from "./CreatePlanModal.module.css";

export default function CreatePlanModal({ onClose, refetchPlans }) {
    const [planName, setPlanName] = useState("");
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState("");
    
    // Начальное состояние с одним пустым упражнением
    const [cycle, setCycle] = useState([
        { 
            id: Date.now(), 
            week_day: "Пн", 
            name: "Силовая тренировка", 
            exercises: [{ name_exercises: "", repeats: "", weight: "" }] 
        }
    ]);

    const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

    // Считаем общее кол-во дней между датами
    const totalDaysCount = useMemo(() => {
        if (!startDate || !endDate) return 0;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1; 
        return diff > 0 ? diff : 0;
    }, [startDate, endDate]);

    const selectedDays = useMemo(() => cycle.map(c => c.week_day), [cycle]);

    const addDayToCycle = () => {
        const nextDay = weekDays.find(d => !selectedDays.includes(d));
        if (!nextDay || cycle.length >= 7) return;
        setCycle([...cycle, { 
            id: Date.now() + Math.random(), 
            week_day: nextDay, 
            name: "Новая тренировка", 
            exercises: [{ name_exercises: "", repeats: "", weight: "" }] 
        }]);
    };

    const updateExercise = (dayId, exIdx, field, value) => {
        setCycle(cycle.map(c => {
            if (c.id === dayId) {
                const newEx = [...c.exercises];
                newEx[exIdx] = { ...newEx[exIdx], [field]: value };
                return { ...c, exercises: newEx };
            }
            return c;
        }));
    };

    const handleCreate = async () => {
        if (!planName || !startDate || !endDate) return alert("Заполни заголовки!");

        const finalDays = [];
        
        // Используем разбивку строки, чтобы избежать проблем с таймзонами
        const [year, month, day] = startDate.split('-').map(Number);
        const start = new Date(year, month - 1, day); 

        for (let i = 0; i < totalDaysCount; i++) {
            const current = new Date(start);
            current.setDate(start.getDate() + i);
            
            // Массив дней недели (0 - Вс, 1 - Пн ...)
            const daysMap = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
            const currentDayName = daysMap[current.getDay()];

            // Ищем шаблон для этого дня недели
            const template = cycle.find(c => c.week_day === currentDayName);

            if (template) {
                const validEx = template.exercises.filter(ex => ex.name_exercises.trim() !== "");
                
                if (validEx.length > 0) {
                    finalDays.push({
                        count_day: i + 1,
                        week_day: currentDayName, 
                        name: template.name || `Тренировка`,
                        icon: 'dumbbells',
                        color: template.color || '#38A169',
                        exercises: validEx.map(ex => ({
                            name_exercises: ex.name_exercises,
                            repeats: String(ex.repeats),
                            weight: parseFloat(ex.weight) || 0
                        }))
                    });
                }
            }
        }

        console.log("Данные для отправки:", finalDays); // ПРОВЕРЬ ТУТ В КОНСОЛИ ПЕРЕД ОТПРАВКОЙ

        try {
            await api.post('/plans', {
                plan_name: planName,
                start_date: startDate,
                end_date: endDate,
                days: finalDays
            });
            if (refetchPlans) await refetchPlans();
            onClose();
        } catch (e) {
            console.error("ОШИБКА БЭКЕНДА:", e.response?.data);
            alert("Ошибка: " + JSON.stringify(e.response?.data?.errors || e.response?.data?.message));
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2>Создание тренировочного плана</h2>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>

                <div className={styles.inputGroup}>
                    <label>Название плана</label>
                    <input className={styles.input} value={planName} onChange={e => setPlanName(e.target.value)} placeholder="Напр: Подготовка к лету" />
                </div>

                <div className={styles.row}>
                    <div className={styles.inputGroup}>
                        <label>Дата старта</label>
                        <input className={styles.input} type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Дата окончания</label>
                        <input className={styles.input} type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </div>
                </div>

                <div className={styles.scrollArea}>
                    {cycle.map((day) => (
                        <div key={day.id} className={styles.dayCard}>
                            <div className={styles.dayHeader}>
                                <select 
                                    className={styles.selectDay} 
                                    value={day.week_day}
                                    onChange={e => setCycle(cycle.map(c => c.id === day.id ? {...c, week_day: e.target.value} : c))}
                                >
                                    {weekDays.map(wd => (
                                        <option key={wd} value={wd} disabled={selectedDays.includes(wd) && day.week_day !== wd}>
                                            {wd}
                                        </option>
                                    ))}
                                </select>
                                <input 
                                    className={styles.input} 
                                    placeholder="Название тренировки (Грудь, Спина...)" 
                                    value={day.name}
                                    onChange={e => setCycle(cycle.map(c => c.id === day.id ? {...c, name: e.target.value} : c))} 
                                />
                                <button className={styles.deleteBtn} onClick={() => setCycle(cycle.filter(c => c.id !== day.id))}>×</button>
                            </div>

                            {day.exercises.map((ex, exIdx) => (
                                <div key={exIdx} className={styles.exerciseRow}>
                                    <input className={styles.input} placeholder="Упражнение" value={ex.name_exercises}
                                           onChange={e => updateExercise(day.id, exIdx, 'name_exercises', e.target.value)} />
                                    <input className={styles.input} style={{width: '60px'}} placeholder="Повт" value={ex.repeats}
                                           onChange={e => updateExercise(day.id, exIdx, 'repeats', e.target.value)} />
                                    <input className={styles.input} style={{width: '60px'}} type="number" placeholder="кг" value={ex.weight}
                                           onChange={e => updateExercise(day.id, exIdx, 'weight', e.target.value)} />
                                </div>
                            ))}
                            <button className={styles.addExBtn} onClick={() => setCycle(cycle.map(c => c.id === day.id ? {...c, exercises: [...c.exercises, {name_exercises: "", repeats: "", weight: ""}]} : c))}>
                                + Добавить упражнение
                            </button>
                        </div>
                    ))}
                </div>

                <div className={styles.footer}>
                    <button className={styles.addDayBtn} onClick={addDayToCycle}>+ Добавить день недели</button>
                    <button className={styles.submitBtn} onClick={handleCreate}>Создать план на {totalDaysCount} дн.</button>
                </div>
            </div>
        </div>
    );
}