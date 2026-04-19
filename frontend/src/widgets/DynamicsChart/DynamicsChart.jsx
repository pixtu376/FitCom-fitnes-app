import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import styles from './DynamicsChart.module.css';

export default function DynamicsChart({ stats }) {
  // 1. Фильтруем категории: убираем 'default' и сортируем 'main' вперед
  const categories = useMemo(() => {
    if (!stats || !stats.length) return [];
    
    const uniqueMap = {};
    stats.forEach(s => {
      // ИГНОРИРУЕМ тип default
      if (s.type !== 'default' && !uniqueMap[s.name_stat]) {
        uniqueMap[s.name_stat] = { name: s.name_stat, type: s.type };
      }
    });
    
    return Object.values(uniqueMap).sort((a, b) => {
      if (a.type === 'main') return -1;
      if (b.type === 'main') return 1;
      return 0;
    });
  }, [stats]);

  const [activeTab, setActiveTab] = useState("");

  useEffect(() => {
    if (categories.length > 0 && !activeTab) {
      setActiveTab(categories[0].name);
    }
  }, [categories, activeTab]);

  const chartData = useMemo(() => {
    return stats
      .filter(s => s.name_stat === activeTab)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .map(s => ({
        date: new Date(s.created_at).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' }),
        val: Number(s.value)
      }));
  }, [stats, activeTab]);

  if (!categories.length) return null;

  return (
    <div className={styles.card}>
      <div className={styles.tabsScroll}>
        {categories.map(cat => (
          <button 
            key={cat.name} 
            className={activeTab === cat.name ? styles.activeTab : styles.tab}
            onClick={() => setActiveTab(cat.name)}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <div style={{ width: '100%', height: 250, marginTop: '20px' }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis dataKey="date" stroke="#888" fontSize={10} />
            <YAxis stroke="#888" fontSize={10} domain={['auto', 'auto']} />
            <Tooltip contentStyle={{ backgroundColor: '#222', border: 'none' }} />
            <Line type="monotone" dataKey="val" stroke="#48CB9F" strokeWidth={3} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}