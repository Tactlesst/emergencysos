import db from '@/lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [deployments] = await db.query(
        `SELECT id, name AS name, status, location, start_time FROM deployments ORDER BY created_at DESC`
      );
      res.status(200).json(deployments); // ✅ Return the rows directly
    } catch (error) {
      console.error('Error fetching deployments:', error);
      res.status(500).json({ error: 'Failed to fetch deployments' });
    }
  } else if (req.method === 'POST') {
    const { name, status, location, start_time } = req.body;

    if (!name || !location || !start_time) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const [result] = await db.query(
        `INSERT INTO deployments (name, status, location, start_time) VALUES (?, ?, ?, ?)`,
        [name, status, location, start_time]
      );

      const newDeployment = {
        id: result.insertId,
        name,
        status,
        location,
        start_time,
      };

      res.status(201).json(newDeployment);
    } catch (error) {
      console.error('Error adding deployment:', error);
      res.status(500).json({ error: 'Failed to add deployment' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
