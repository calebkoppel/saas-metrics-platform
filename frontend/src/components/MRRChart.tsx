import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MRRMetric } from '../types/metrics';
import { format, parseISO } from 'date-fns';

interface MRRChartProps {
  data: MRRMetric[];
  loading: boolean;
}

const MRRChart: React.FC<MRRChartProps> = ({ data, loading }) => {
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
    total_mrr: Math.round(item.total_mrr),
  }));

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Recurring Revenue</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip 
            formatter={(value) => formatCurrency(value as number)}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="total_mrr" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Total MRR"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MRRChart;