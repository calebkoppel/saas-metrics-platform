import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UsersPlan } from '../types/metrics';

interface UserChartProps {
  data: UsersPlan[];
  loading: boolean;
}

const UsersChart: React.FC<UserChartProps> = ({ data, loading }) => {
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
  }));


  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Users By Subscription</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="plan_type" />
          <YAxis />
          <Tooltip 
            formatter={(user_count) => (user_count as number)}
          />
          <Legend />
          <Bar 
            dataKey="user_count" 
            fill="#4486ef"
            name="Users"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsersChart;