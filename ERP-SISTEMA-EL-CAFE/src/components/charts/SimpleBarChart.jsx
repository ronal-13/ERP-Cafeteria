import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const SimpleBarChart = ({ data = [], xKey, yKey, title, color = '#16a34a' }) => {
  return (
    <div className="card" style={{ padding: 16 }}>
      {title && <h3 className="section-title" style={{ marginBottom: 8 }}>{title}</h3>}
      <div style={{ width: '100%', height: 260 }}>
        {(!data || data.length === 0) && (
          <div className="stat-label" style={{ textAlign: 'center', paddingTop: 20 }}>Sin datos</div>
        )}
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip cursor={{ fill: 'transparent' }} />
            <Bar dataKey={yKey} fill={color} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SimpleBarChart;
