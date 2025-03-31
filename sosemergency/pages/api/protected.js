// pages/api/protected.js
import jwt from 'jsonwebtoken';

export default function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Role check example
    if (decoded.userType !== 'super_admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    res.status(200).json({ secretData: 'Admin only!' });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}