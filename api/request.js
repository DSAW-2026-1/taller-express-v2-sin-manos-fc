const jwt = require('jsonwebtoken');

const secretKey = 'mySecretKey';

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "You're not allowed to do this" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedData = jwt.verify(token, secretKey);

    if (decodedData.userRole === 'ADMIN') {
      return res.status(200).json({ message: 'Hi from ADMIN' });
    }

    if (decodedData.userRole === 'USER') {
      return res.status(200).json({ message: 'Hi from USER' });
    }

    return res.status(401).json({ message: "You're not allowed to do this" });

  } catch {
    return res.status(401).json({ message: "You're not allowed to do this" });
  }
};