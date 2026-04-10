const jwt = require('jsonwebtoken');

const secretKey = 'mySecretKey';

const users = [
  { id: 1, userName: 'ADMIN', password: 'ADMIN', role: 'ADMIN' },
  { id: 2, userName: 'USER', password: 'USER', role: 'USER' }
];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userName, password } = req.body;

  const foundUser = users.find(
    user => user.userName === userName && user.password === password
  );

  if (!foundUser) {
    return res.status(400).json({ message: 'invalid credentials' });
  }

  const token = jwt.sign(
    { userId: foundUser.id, userRole: foundUser.role },
    secretKey,
    { expiresIn: '1h' }
  );

  res.status(200).json({ token: token });
};

    