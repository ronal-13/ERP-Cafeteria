import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const SimpleAreaChart = ({ data = [], xKey, yKey, title }) => {
  return (
    <div className="card" style={{ padding: 16 }}>
      {title && (
        <h3 className="section-title" style={{ marginBottom: 8 }}>
          {title}
        </h3>
      )}
      <div style={{ width: "100%", height: 260 }}>
        {(!data || data.length === 0) && (
          <div
            className="stat-label"
            style={{ textAlign: "center", paddingTop: 20 }}
          >
            Sin datos
          </div>
        )}
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip cursor={{ stroke: "transparent" }} />
            <Area
              type="monotone"
              dataKey={yKey}
              stroke="#2563eb"
              fillOpacity={1}
              fill="url(#colorPrimary)"
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SimpleAreaChart;
