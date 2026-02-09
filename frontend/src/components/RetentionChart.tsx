import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CohortRetention } from '../types/metrics';
import { format, parseISO } from 'date-fns';

interface RetentionChartProps {
  data: CohortRetention[];
  loading: boolean;
}

const RetentionChart: React.FC<RetentionChartProps> = ({ data, loading }) => {
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
    cohort_month: format(parseISO(item.cohort_month), 'MMM yyyy'),
    m1_retention: Math.round(item.m1_retention),
    m3_retention: Math.round(item.m3_retention),
    m6_retention: Math.round(item.m6_retention),
    m12_retention: Math.round(item.m12_retention),
  }));

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Cohort Retention Rate</h2>
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
            stroke="#0abb25" 
            strokeWidth={2}
            name="Total MRR"
          />
          <Line 
            type="monotone" 
            dataKey="total_mrr" 
            stroke="#0abb25" 
            strokeWidth={2}
            name="Total MRR"
          />
          <Line 
            type="monotone" 
            dataKey="total_mrr" 
            stroke="#0abb25" 
            strokeWidth={2}
            name="Total MRR"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RetentionChart;