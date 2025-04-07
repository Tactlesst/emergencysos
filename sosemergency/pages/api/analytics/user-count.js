// pages/api/analytics/usercount.js
import db from '@/lib/db'; // adjust as needed

export default async function handler(req, res) {
  try {
    const [rows] = await db.execute(
      `
      SELECT 
        userType, 
        COUNT(*) AS count 
      FROM users 
      GROUP BY userType
      `
    );

    const total = rows.reduce((sum, row) => sum + row.count, 0);

    return res.status(200).json({
      totalUsers: total,
      breakdown: rows
    });
  } catch (error) {
    console.error('Error in /api/analytics/usercount:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
