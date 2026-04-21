import React, { useState, useEffect } from 'react';
import api from "../../app/api";
import styles from './MeasurementsPanel.module.css';
import AddStatModal from '../AddStatModal/AddStatModal';
import { FiPlus } from 'react-icons/fi';

export default function MeasurementsPanel({ stats, refetch, isModalOpen, setIsModalOpen }) {
  const [formValues, setFormValues] = useState({});
  const [units, setUnits] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (!stats || !stats.length) return;
    const latest = {};
    const meta = {};
    stats.forEach(s => {
      latest[s.name_stat] = s.value;
      meta[s.name_stat] = s.unit;
    });
    setFormValues(latest);
    setUnits(meta);
  }, [stats]);

  const handleUpdateSelectedStats = (selectedFullNames) => {
    setFormValues(prev => {
      const nextValues = { ...prev };
      const nextUnits = { ...units };

      selectedFullNames.forEach(fullName => {
        let name = fullName;
        let unit = '—';

        if (fullName.includes('(')) {
          const parts = fullName.split('(');
          name = parts[0].trim();
          unit = parts[1].replace(')', '').trim();
        }

        if (!(name in nextValues)) {
          nextValues[name] = ''; 
          nextUnits[name] = unit;
        }
      });
      
      setUnits(nextUnits);
      return nextValues;
    });
  };

  const handleDeleteStats = async (namesToDelete) => {
    if (!namesToDelete.length) return;
    if (!window.confirm(`Удалить параметры: ${namesToDelete.join(', ')}?`)) return;
    try {
      await api.delete('/user/stat/delete-by-name', { data: { names: namesToDelete } });
      refetch();
    } catch (e) { console.error(e); }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const payload = {
      measurements: Object.keys(formValues)
        .filter(name => formValues[name] !== '')
        .map(name => ({
          name_stat: name,
          value: Number(formValues[name]),
          unit: units[name]
        }))
    };

    try {
      await api.post('/user/create_stat', payload);
      refetch();
      alert("Данные обновлены");
    } catch (e) { console.error(e); } 
    finally { setIsSaving(false); }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.cardTitle}>Изменить замеры</h3>
        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          <FiPlus />
        </button>
      </div>

      <div className={styles.grid}>
        {Object.keys(formValues).map(name => (
          <div key={name} className={styles.inputField}>
            <label>{name} ({units[name]})</label>
            <input 
              type="number" step="0.1"
              value={formValues[name]} 
              onChange={(e) => setFormValues({...formValues, [name]: e.target.value})}
              placeholder="0.0"
            />
          </div>
        ))}
      </div>

      <button className={styles.saveBtn} onClick={handleSave} disabled={isSaving || Object.keys(formValues).length === 0}>
        {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
      </button>

      <AddStatModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        stats={stats || []}
        onUpdate={handleUpdateSelectedStats} 
        onDelete={handleDeleteStats}
      />
    </div>
  );
}