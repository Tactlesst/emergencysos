import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

export default function AnalyticsPage() {
  const [userCount, setUserCount] = useState(null);
  const [userBreakdown, setUserBreakdown] = useState([]);
  const [loginData, setLoginData] = useState({ labels: [], data: [] });
  const [registrationData, setRegistrationData] = useState({ labels: [], data: [] });
  const [activeUsers, setActiveUsers] = useState(0);
  const [timeRange, setTimeRange] = useState('24h'); // '24h', '7d', '30d'

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const rangeParam = `?range=${timeRange}`;

        const [userCountRes, loginRes, regRes, activeRes] = await Promise.all([
          fetch('/api/analytics/user-count'),
          fetch(`/api/analytics/login${rangeParam}`),
          fetch(`/api/analytics/registration${rangeParam}`),
          fetch('/api/analytics/active-users'),
        ]);

        const userCountData = await userCountRes.json();
        const loginDataRes = await loginRes.json();
        const regDataRes = await regRes.json();
        const activeData = await activeRes.json();

        setUserCount(userCountData.totalUsers);
        setUserBreakdown(userCountData.breakdown);
        setActiveUsers(activeData.activeUsers || 0);

        setLoginData({
          labels: loginDataRes.map(item => new Date(item.time)),
          data: loginDataRes.map(item => item.count),
        });

        setRegistrationData({
          labels: regDataRes.map(item => new Date(item.dateCreated)),
          data: regDataRes.map(item => item.count),
        });

      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  const loginAvg = loginData.data.length > 0
    ? (loginData.data.reduce((a, b) => a + b, 0) / loginData.data.length).toFixed(1)
    : 0;

  const registrationAvg = registrationData.data.length > 0
    ? (registrationData.data.reduce((a, b) => a + b, 0) / registrationData.data.length).toFixed(1)
    : 0;

  const totalLogins = loginData.data.reduce((a, b) => a + b, 0);
  const totalRegistrations = registrationData.data.reduce((a, b) => a + b, 0);

  const chartData = {
    datasets: [
      {
        label: 'Logins',
        data: loginData.labels.map((date, i) => ({ x: date, y: loginData.data[i] })),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        borderWidth: 2,
      },
      {
        label: 'Registrations',
        data: registrationData.labels.map((date, i) => ({ x: date, y: registrationData.data[i] })),
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        tension: 0.1,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: `User Activity - Last ${timeRange === '24h' ? '24 Hours' : timeRange === '7d' ? '7 Days' : '30 Days'}`,
      },
      tooltip: {
        callbacks: {
          title: (context) => new Date(context[0].raw.x).toLocaleString(),
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: timeRange === '24h' ? 'hour' : 'day',
          displayFormats: { hour: 'HH:mm', day: 'MMM dd' },
        },
        title: { display: true, text: 'Time' },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Count' },
      },
    },
  };

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans text-gray-800">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">User Analytics Dashboard</h1>

      {/* Time range selector */}
      <div className="flex gap-2 mb-6">
        {['24h', '7d', '30d'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-md ${timeRange === range ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {range === '24h' ? 'Last 24 Hours' : range === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <SummaryCard title="Total Users" value={userCount?.toLocaleString() ?? 'Loading...'} color="text-blue-500" />
        <SummaryCard title="Total Logins" value={totalLogins} sub={`Avg: ${loginAvg}/hr`} color="text-green-500" />
        <SummaryCard title="Total Registrations" value={totalRegistrations} sub={`Avg: ${registrationAvg}/day`} color="text-purple-500" />
        <SummaryCard title="Active Now" value={activeUsers} sub="Current hour" color="text-orange-500" />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200 mb-8">
        <Line data={chartData} options={options} />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ActivityCard title="Recent Logins (Last 10)" data={loginData} color="green" />
        <ActivityCard title="Recent Registrations (Last 10)" data={registrationData} color="purple" />
      </div>

      {/* Breakdown by userType */}
      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b mb-4">User Type Breakdown</h3>
        <ul className="space-y-2">
          {userBreakdown.map((item, i) => (
            <li key={i} className="flex justify-between text-sm text-gray-700">
              <span className="capitalize">{item.userType}</span>
              <span className="font-semibold">{item.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, sub, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className={`text-3xl font-bold ${color} my-2`}>{value}</p>
      {sub && <p className="text-sm text-gray-500">{sub}</p>}
    </div>
  );
}

function ActivityCard({ title, data, color }) {
  const colorClasses = {
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    blue: 'bg-blue-100 text-blue-800',
    orange: 'bg-orange-100 text-orange-800',
    red: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">{title}</h3>
      <div className="mt-4 space-y-2">
        {data.labels.length === 0 ? (
          <p className="text-gray-500">No data available</p>
        ) : (
          data.labels.slice(-10).reverse().map((date, i) => {
            const dataIndex = data.labels.length - 1 - i;
            return (
              <div key={i} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="font-medium">{date.toLocaleString()}</span>
                <span className={`${colorClasses[color]} px-2 py-1 rounded-full text-sm`}>
                  {data.data[dataIndex]} {title.includes('Login') ? 'logins' : 'new users'}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
