export default function handler(req, res) {
    const { authorization } = req.headers;
  
    if (!authorization) {
      return res.status(401).json({ error: 'Token missing' });
    }
  
    const token = authorization.split(' ')[1];
  
    // Mock validation (replace with JWT verify)
    if (token === 'fake-jwt-token') {
      res.status(200).json({ isValid: true });
    } else {
      res.status(401).json({ isValid: false });
    }
  }