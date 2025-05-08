// pages/api/reports.js
import db from '@/lib/db';

export default async function handler(req, res) {
  const { type } = req.query;

  try {
    let query = '';
    switch (type) {
      case 'user_activity':
        query = `
          SELECT id, first_name, last_name, mobile, role, last_login
          FROM users
          ORDER BY last_login DESC
        `;
        break;
      case 'deployments':
        query = `
          SELECT id, name, location, status, start_time
          FROM deployments
          ORDER BY start_time DESC
        `;
        break;
      case 'incidents':
        query = `
          SELECT id, type, location, status, reported_at
          FROM incidents
          ORDER BY reported_at DESC
        `;
        break;
      default:
        return res.status(400).json({ error: 'Invalid report type' });
    }

    const [results] = await db.query(query);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
