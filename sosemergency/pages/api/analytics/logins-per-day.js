// pages/api/analytics/logins-per-day.js
import { query } from '../../../lib/db';

export default async function handler(req, res) {
  try {
    // Get time range from query params (default to 7 days)
    const range = req.query.range || '7d';
    let interval, dateFormat;
    
    // Set SQL parameters based on time range
    switch(range) {
      case '24h':
        interval = '1 HOUR';
        dateFormat = '%Y-%m-%d %H:00:00'; // Hourly grouping
        break;
      case '7d':
        interval = '1 DAY';
        dateFormat = '%Y-%m-%d'; // Daily grouping
        break;
      case '30d':
        interval = '1 DAY';
        dateFormat = '%Y-%m-%d'; // Daily grouping
        break;
      default:
        return res.status(400).json({ message: 'Invalid time range' });
    }

    // Calculate the start date based on the range
    let startDate;
    const now = new Date();
    
    if (range === '24h') {
      startDate = new Date(now.setDate(now.getDate() - 1));
    } else if (range === '7d') {
      startDate = new Date(now.setDate(now.getDate() - 7));
    } else { // 30d
      startDate = new Date(now.setDate(now.getDate() - 30));
    }

    // SQL query to count logins grouped by time period
    const results = await query(`
      SELECT 
        DATE_FORMAT(login_time, ?) AS time_period,
        COUNT(*) AS count
      FROM login_logs
      WHERE login_time >= ?
      GROUP BY time_period
      ORDER BY time_period ASC
    `, [dateFormat, startDate]);

    // Format the results for the chart
    const formattedResults = results.map(row => ({
      time: range === '24h' 
        ? new Date(row.time_period.replace(' ', 'T') + ':00Z') 
        : new Date(row.time_period + 'T00:00:00Z'),
      count: row.count
    }));

    res.status(200).json(formattedResults);
  } catch (error) {
    console.error('Error fetching login stats:', error);
    res.status(500).json({ message: 'Error fetching login data' });
  }
}