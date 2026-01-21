import React, { useEffect, useState } from 'react';
import { getMRR, getChurn, getSummary, getUsers } from './services/api';
import { MRRMetric, ChurnMetric, Summary, UsersPlan } from './types/metrics';
import KPICards from './components/KPICards';
import MRRChart from './components/MRRChart';
import ChurnChart from './components/ChurnChart';
import UsersChart from './components/UsersChart';

function App() {
  const [mrrData, setMrrData] = useState<MRRMetric[]>([]);
  const [churnData, setChurnData] = useState<ChurnMetric[]>([]);
  const [usersData, setUsersData] = useState<UsersPlan[]>([])
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [mrrResponse, churnResponse, summaryResponse, usersResponse] = await Promise.all([
          getMRR(),
          getChurn(),
          getSummary(),
          getUsers()
        ]);

        setUsersData(usersResponse);
        setMrrData(mrrResponse);
        setChurnData(churnResponse);
        setSummary(summaryResponse);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Make sure the API is running on http://localhost:8000');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            SaaS Metrics Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Real-time analytics for subscription metrics
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <KPICards summary={summary} loading={loading} />

        <div className="grid grid-cols-1 gap-6 mb-6">
          <MRRChart data={mrrData} loading={loading} />
          <ChurnChart data={churnData} loading={loading} />
          <UsersChart data={usersData} loading={loading} />
        </div>
      </main>
    </div>
  );
}

export default App;