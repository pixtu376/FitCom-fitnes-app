import React, { useState, useEffect } from 'react';
import { FiX, FiPlus, FiCheck } from 'react-icons/fi';
import styles from './AddStatModal.module.css';

export default function AddStatModal({ isOpen, onClose, stats = [], onUpdate, onDelete }) {
  const [selected, setSelected] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);
  const [custom, setCustom] = useState({ active: false, name: '', unit: '' });

  // Список категорий (оставь как был)
  const categories = [
    { title: "Основные параметры тела", items: ["Вес (кг)", "Бицепс Л (см)", "Бицепс П (см)", "ИМТ (Индекс массы тела)", "Рост (см)"] },
    { title: "Антропометрия (Дополнительно)", items: ["Обхват Груди", "Обхват Шеи", "Обхват голени", "Обхват Таза", "Обхват Талии"] },
    { title: "Силовые показатели", items: ["Жим Лежа", "Присед", "Становая", "Макс. Подт."] },
    { title: "Выносливость & кардио", items: ["Время Бега 5км", "Дистанция 10км", "Темп 5км (мин/км)", "Каденс (время)"] }
  ];

  useEffect(() => {
    if (isOpen) {
      setSelected([]);
      setDeleteMode(false);
      setCustom({ active: false, name: '', unit: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggle = (val) => setSelected(p => p.includes(val) ? p.filter(i => i !== val) : [...p, val]);

  // Функция "временного" добавления своего параметра в список
  const handleTempAddCustom = () => {
    if (custom.name.trim()) {
      const fullName = `${custom.name.trim()} (${custom.unit.trim() || '—'})`;
      
      // Если такого параметра еще нет в выбранных — добавляем
      if (!selected.includes(fullName)) {
        setSelected([...selected, fullName]);
      }
      
      // Сбрасываем поля ввода, но НЕ ЗАКРЫВАЕМ модалку и НЕ ВЫЗЫВАЕМ onUpdate
      setCustom({ active: false, name: '', unit: '' });
    }
  };

  const handleApply = () => {
    // Теперь handleApply отправляет ВСЁ: и чекбоксы, и добавленные кастомные строки
    if (deleteMode) {
      onDelete(selected.map(s => s.split(' (')[0]));
    } else {
      onUpdate(selected);
    }
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{deleteMode ? "Удаление параметров" : "Настройка параметров"}</h2>
          <button onClick={onClose} className={styles.closeBtn}><FiX /></button>
        </div>

        <div className={styles.content}>
          {/* Рендерим категории (чекбоксы) */}
          {categories.map(cat => {
            const items = deleteMode 
              ? cat.items.filter(i => stats.some(s => s.name_stat === i.split(' (')[0]))
              : cat.items;

            if (!items.length && deleteMode) return null;

            return (
              <div key={cat.title} className={styles.section}>
                <h4 className={styles.sectionTitle}>{cat.title}</h4>
                <div className={styles.checkboxGrid}>
                  {items.map(item => (
                    <label key={item} className={styles.checkboxLabel}>
                      <input type="checkbox" checked={selected.includes(item)} onChange={() => toggle(item)} />
                      <span className={`${styles.customCheck} ${deleteMode ? styles.delCheck : ''}`}></span>
                      {item}
                    </label>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Секция выбранных кастомных параметров (визуальное подтверждение) */}
          {selected.filter(item => !categories.flatMap(c => c.items).includes(item)).length > 0 && (
            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Добавленные вручную</h4>
              <div className={styles.checkboxGrid}>
                {selected
                  .filter(item => !categories.flatMap(c => c.items).includes(item))
                  .map(item => (
                    <label key={item} className={styles.checkboxLabel}>
                      <input type="checkbox" checked={true} onChange={() => toggle(item)} />
                      <span className={styles.customCheck}></span>
                      {item}
                    </label>
                  ))
                }
              </div>
            </div>
          )}

          <div className={styles.actions}>
            {!deleteMode && (
              !custom.active ? (
                <button className={styles.btnSmall} onClick={() => setCustom({...custom, active: true})}><FiPlus /> Свой параметр</button>
              ) : (
                <div className={styles.customRow}>
                  <input placeholder="Имя" value={custom.name} onChange={e => setCustom({...custom, name: e.target.value})} />
                  <input placeholder="Ед." value={custom.unit} onChange={e => setCustom({...custom, unit: e.target.value})} className={styles.unitInp} />
                  {/* Теперь эта кнопка только подтверждает ввод для списка, но не сохраняет в БД */}
                  <button type="button" onClick={handleTempAddCustom}><FiCheck /></button>
                </div>
              )
            )}
            <button className={`${styles.btnSmall} ${deleteMode ? styles.activeDel : ''}`} onClick={() => {setDeleteMode(!deleteMode); setSelected([]);}}>
              {deleteMode ? "К добавлению" : "Режим удаления"}
            </button>
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Отмена</button>
          {/* ФИНАЛЬНАЯ КНОПКА: Применяет всё сразу */}
          <button className={`${styles.applyBtn} ${deleteMode ? styles.danger : ''}`} onClick={handleApply}>
            {deleteMode ? "Удалить выбранные" : "Применить"}
          </button>
        </div>
      </div>
    </div>
  );
}