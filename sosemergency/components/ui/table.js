import React from 'react';

export function Table({ headers = [], data = [], className = '' }) {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="min-w-full border border-gray-200 bg-white shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-4 py-4 text-center text-gray-500">
                No data available.
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t">
                {headers.map((header, colIndex) => (
                  <td key={colIndex} className="px-4 py-2 text-sm text-gray-800">
                    {row[header.toLowerCase().replace(/\s+/g, '_')] || ''}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
