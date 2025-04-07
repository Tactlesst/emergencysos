import { query } from '@/lib/db';

export default async function handler(req, res) {
  try {
    const result = await query(
      `SELECT COUNT(DISTINCT user_id) as activeUsers 
       FROM logins 
       WHERE dateCreated >= NOW() - INTERVAL 1 HOUR`
    );
    res.status(200).json({ activeNow: result[0].activeUsers });
  } catch (error) {
    console.error('Error fetching active users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
