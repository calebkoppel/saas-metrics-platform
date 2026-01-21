import React from 'react';
import { Summary } from '../types/metrics';

interface KPICardsProps {
  summary: Summary | null;
  loading: boolean;
}

const KPICards: React.FC<KPICardsProps> = ({ summary, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!summary) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const cards = [
    {
      title: 'Current MRR',
      value: formatCurrency(summary.current_mrr),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Subscribers',
      value: formatNumber(summary.active_subscribers),
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Churn Rate',
      value: `${summary.churn_rate.toFixed(2)}%`,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Avg MRR per User',
      value: formatCurrency(summary.avg_mrr_per_user),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <div key={index} className={`${card.bgColor} p-6 rounded-lg shadow`}>
          <h3 className="text-sm font-medium text-gray-600 mb-2">{card.title}</h3>
          <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default KPICards;