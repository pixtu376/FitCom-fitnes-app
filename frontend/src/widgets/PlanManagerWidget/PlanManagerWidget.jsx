import React, { useRef, useState } from 'react';
import api from "../../app/api";
import styles from "../../pages/Trainings/Training.module.css";
import Tesseract from 'tesseract.js';

export default function PlanManagerWidget({ refetchPlans, onOpenCreate }) {
    const fileInputRef = useRef(null);
    const docInputRef = useRef(null); // Реф для загрузки файлов (документов)
    const [isParsing, setIsParsing] = useState(false);

    // «Пиздец какой умный» парсер
    const parseRawText = (text) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 1);
    const days = [];
    let currentDay = null;

    const dayKeywords = { 
        "пн": "Пн", "вт": "Вт", "ср": "Ср", "чт": "Чт", "пт": "Пт", "сб": "Сб", "вс": "Вс"
    };

    lines.forEach(line => {
        const lower = line.toLowerCase();
        const foundDayKey = Object.keys(dayKeywords).find(k => lower.includes(k));

        if (foundDayKey) {
            if (currentDay) days.push(currentDay);
            currentDay = {
                week_day: dayKeywords[foundDayKey],
                count_day: days.length + 1,
                exercises: [],
                icon: 'dumbbells', 
                color: '#38A169'
            };
        } else if (currentDay) {
            // Регулярка теперь просто берет часть с цифрами как строку
            const exMatch = line.match(/(.*?)\s*(\d+\s*(?:[xх*]|по)\s*\d+.*)/i);
            
            if (exMatch) {
                currentDay.exercises.push({
                    name_exercises: exMatch[1].replace(/^\d+[.\s]*/, '').trim() || "Упражнение",
                    repeats: exMatch[2].trim(), // Сохраняем "12x3" как строку
                    weight: 0 // Вес можно вытянуть отдельной логикой, если он есть в конце
                });
            } else {
                currentDay.exercises.push({ 
                    name_exercises: line.replace(/^\d+[.\s]*/, '').trim(), 
                    repeats: "0", 
                    weight: 0 
                });
            }
        }
    });

    if (currentDay) days.push(currentDay);
    return days;
};

    // Обработка фото через Tesseract
    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsParsing(true);
        try {
            // Распознаем текст с картинки (русский + английский)
            const { data: { text } } = await Tesseract.recognize(file, 'rus+eng');
            
            const parsedDays = parseRawText(text);

            if (parsedDays.length === 0) {
                alert("Не удалось распознать тренировки. Попробуйте более четкое фото.");
                return;
            }

            await api.post('/plans', {
                plan_name: `Сканирование ${new Date().toLocaleDateString()}`,
                start_date: new Date().toISOString().split('T')[0],
                end_date: new Date(Date.now() + 28 * 86400000).toISOString().split('T')[0],
                days: parsedDays
            });
            
            refetchPlans();
        } catch (err) {
            console.error(err);
            alert("Ошибка при сканировании текста");
        } finally {
            setIsParsing(false);
            e.target.value = null; // сброс инпута
        }
    };

    // Обработка файла (пока заглушка под будущий формат)
    const handleFileLoad = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        alert(`Файл ${file.name} получен. Логика обработки файла будет добавлена позже.`);
        e.target.value = null;
    };

    return (
        <div>
            <div className={styles.managementGrid}>
                <div className={styles.btnGroup}>
                    {/* Кнопка открытия твоей новой модалки */}
                    <button className={styles.btn} onClick={onOpenCreate}>
                        <img src="/icons/plus.svg" alt="" className={styles.iconSmall} />
                        Создать новый план
                    </button>

                    {/* Кнопка загрузки файла (вместо второго скана) */}
                    <button className={styles.btn} onClick={() => docInputRef.current.click()}>
                        <img src="/icons/download.svg" alt="" className={styles.iconSmall} />
                        Загрузить файл
                    </button>
                    <input 
                        type="file" 
                        ref={docInputRef} 
                        hidden 
                        onChange={handleFileLoad} 
                        accept=".txt,.pdf,.doc,.docx" 
                    />
                </div>

                {/* Кнопка сканирования фото (Tesseract) */}
                <div className={styles.photoUpload} onClick={() => fileInputRef.current.click()}>
                    <img src="/icons/camera.svg" alt="camera" />
                    <span>{isParsing ? "Парсинг..." : "Из фото"}</span>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        hidden 
                        onChange={handlePhotoUpload} 
                        accept="image/*" 
                    />
                </div>
            </div>
            
            <input 
                type="text" 
                placeholder="Описать текущий план (AI - скоро)" 
                className={styles.input} 
            />
        </div>
    );
}