import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';

const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#64748b', '#9333ea'];

const SimplePieChart = ({ data = [], nameKey, valueKey, title }) => {
  return (
    <div className="card" style={{ padding: 16 }}>
      {title && <h3 className="section-title" style={{ marginBottom: 8 }}>{title}</h3>}
      <div style={{ width: '100%', height: 260 }}>
        {(!data || data.length === 0) && (
          <div className="stat-label" style={{ textAlign: 'center', paddingTop: 20 }}>Sin datos</div>
        )}
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey={valueKey} nameKey={nameKey} cx="50%" cy="50%" outerRadius={80} label>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SimplePieChart;
