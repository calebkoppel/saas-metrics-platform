import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChurnMetric } from '../types/metrics';
import { format, parseISO } from 'date-fns';

interface ChurnChartProps {
  data: ChurnMetric[];
  loading: boolean;
}

const ChurnChart: React.FC<ChurnChartProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
        <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  const formattedData = data.map(item => ({
    ...item,
    month: format(parseISO(item.month), 'MMM yyyy'),
  }));

  const formatPercent = (value: number) => `${value.toFixed(2)}%`;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Churn Rate</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip 
            formatter={(value) => formatPercent(value as number)}
          />
          <Legend />
          <Bar 
            dataKey="churn_rate_percent" 
            fill="#ef4444"
            name="Churn Rate %"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChurnChart;