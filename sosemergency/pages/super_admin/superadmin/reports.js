// pages/reports.js
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CSVLink } from 'react-csv';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('');
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReport = async (type) => {
    setReportType(type);
    setLoading(true);
    try {
      const res = await fetch(`/api/reports?type=${type}`);
      const result = await res.json();

      if (result && result.length > 0) {
        setHeaders(Object.keys(result[0]).map((key) => ({ label: key.replace('_', ' '), key })));
        setData(result);
      } else {
        setHeaders([]);
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      setData([]);
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Reports</h1>
      <p className="mb-6 text-gray-700">Generate and export reports like user activity, deployments, and incident logs.</p>

      <div className="space-x-3 mb-6">
        <Button onClick={() => fetchReport('user_activity')}>User Activity</Button>
        <Button onClick={() => fetchReport('deployments')}>Deployments</Button>
        <Button onClick={() => fetchReport('incidents')}>Incidents</Button>
      </div>

      {loading && <p>Loading report...</p>}

      {!loading && data.length > 0 && (
        <div className="bg-white border p-4 rounded shadow">
          <h2 className="text-xl font-semibold capitalize mb-4">{reportType.replace('_', ' ')} Report</h2>
          <div className="overflow-auto max-h-96 mb-4">
            <table className="w-full table-auto text-sm border">
              <thead className="bg-gray-100 text-left">
                <tr>
                  {headers.map((col) => (
                    <th key={col.key} className="px-4 py-2 border">{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className="even:bg-gray-50">
                    {headers.map((col) => (
                      <td key={col.key} className="px-4 py-2 border">{row[col.key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <CSVLink
            data={data}
            headers={headers}
            filename={`${reportType}_report.csv`}
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Export CSV
          </CSVLink>
        </div>
      )}

      {!loading && reportType && data.length === 0 && (
        <p className="text-gray-600">No data available for this report.</p>
      )}
    </div>
  );
}
