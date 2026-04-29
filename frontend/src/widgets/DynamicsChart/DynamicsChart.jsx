import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';
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
    if (!activeTab) return [];
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

  const dataMap = useMemo(() => new Map(chartData.map(d => [d.xAxisKey, d])), [chartData]);

  if (!categories.length) return null;

  return (
    <div className={styles.container}>
      <div className={styles.tabsContainer}>
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
      </div>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%" minHeight={250} debounce={50}>
          <AreaChart 
            data={chartData} 
            margin={{ left: -15, right: 5, top: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-green)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--accent-green)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            
            <XAxis 
              dataKey="xAxisKey" 
              stroke="var(--text-gray)" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => dataMap.get(val)?.dateLabel || ''}
              minTickGap={20}
              dy={10}
            />
            
            <YAxis 
              stroke="var(--text-gray)" 
              fontSize={10} 
              domain={['dataMin - 1', 'dataMax + 1']} 
              tickLine={false}
              axisLine={false}
              width={35}
            />
            
            <Tooltip 
              content={<CustomTooltip dataMap={dataMap} />}
              isAnimationActive={false}
              cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
            />
            
            <Area 
              type="monotone"
              dataKey="val" 
              stroke="var(--accent-green)" 
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorVal)"
              dot={{ r: 3, fill: "var(--card-bg)", stroke: "var(--accent-green)", strokeWidth: 2 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label, dataMap }) => {
  if (active && payload && payload.length) {
    const item = dataMap.get(label);
    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipDate}>{item?.fullDate}</p>
        <p className={styles.tooltipValue}>
          <span>Значение:</span> {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};