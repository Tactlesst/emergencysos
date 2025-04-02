import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Return userType and other basic info
    return res.status(200).json({
      userType: decoded.userType,
      phone: decoded.phone,
      userId: decoded.userId
    });

  } catch (error) {
    return res.status(401).json({ 
      message: 'Invalid token',
      error: error.message 
    });
  }
}