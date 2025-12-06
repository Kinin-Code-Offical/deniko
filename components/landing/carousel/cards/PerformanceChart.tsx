"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface PerformanceChartProps {
  data: { name: string; value: number }[];
  colors: string[];
  darkColors: string[];
  width: number;
  height: number;
}

export default function PerformanceChart({
  data,
  colors,
  darkColors,
  width,
  height,
}: PerformanceChartProps) {
  return (
    <ResponsiveContainer width={width} height={height} debounce={50}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          startAngle={90}
          endAngle={-270}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
              className="dark:hidden"
            />
          ))}
          {data.map((entry, index) => (
            <Cell
              key={`cell-dark-${index}`}
              fill={darkColors[index % darkColors.length]}
              className="hidden dark:block"
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
