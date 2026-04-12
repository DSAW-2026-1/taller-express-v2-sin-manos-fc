import jwt from 'jsonwebtoken';

const USERS = [
  { id: 1, username: 'admin', password: 'admin123', role: 'ADMIN' },
  { id: 2, username: 'user',  password: 'user123',  role: 'USER'  },
];
export const login = (req, res) => {
  const { username, password } = req.body;
  const found = USERS.find(
    (u) => u.username === username && u.password === password
  );
  if (!found) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign(
    { id: found.id, username: found.username, role: found.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  return res.status(200).json({ token });
};
