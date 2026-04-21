import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import styles from './DynamicsChart.module.css';

export default function DynamicsChart({ stats }) {
  const categories = useMemo(() => {
    if (!stats || !stats.length) return [];
    
    const uniqueMap = {};
    stats.forEach(s => {
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
      .filter(s => s.value !== null && s.value !== undefined && !isNaN(parseFloat(s.value)))
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .map((s, index) => {
        const dateObj = new Date(s.created_at);
        return {
          xAxisKey: `${dateObj.getTime()}-${index}`,
          
          dateLabel: dateObj.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' }),
          
          fullDate: dateObj.toLocaleString('ru-RU', { 
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
          }),
          
          val: parseFloat(s.value),
        };
      });
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

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="99%" height="100%">
          <LineChart data={chartData} margin={{ left: -20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            
            <XAxis 
              dataKey="xAxisKey" 
              stroke="#888" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
              padding={{ left: 10, right: 10 }}
              tickFormatter={(value) => {
                const item = chartData.find(d => d.xAxisKey === value);
                return item ? item.dateLabel : '';
              }}
              minTickGap={30}
            />
            
            <YAxis 
              stroke="#888" 
              fontSize={10} 
              domain={['dataMin - 1', 'dataMax + 1']} 
              tickLine={false}
              axisLine={false}
            />
            
            <Tooltip 
              contentStyle={{ backgroundColor: '#222', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#fff', fontSize: '12px' }}
              itemStyle={{ color: '#48CB9F' }}
              labelFormatter={(value) => {
                const item = chartData.find(d => d.xAxisKey === value);
                return item ? item.fullDate : value;
              }}
            />
            
            <Line 
              type="monotone"
              dataKey="val" 
              stroke="#48CB9F" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#48CB9F', strokeWidth: 2, stroke: '#22252A' }}
              activeDot={{ r: 6 }}
              connectNulls={true} 
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}