const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const { validateUser } = require('./validation');
const { auth } = require('./middleware');

const router = express.Router();

function tokenFor(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
}

router.post('/signup', async (req, res) => {
  try {
    const { name, email, address, password } = req.body;
    const errors = validateUser({ name, email, address, password });
    if (Object.keys(errors).length) return res.status(400).json({ message: 'Validation failed', errors });

    const [exists] = await pool.query('SELECT id FROM users WHERE email=?', [email]);
    if (exists.length) return res.status(409).json({ message: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users(name,email,password_hash,address,role) VALUES(?,?,?,?,?)',
      [name.trim(), email.trim().toLowerCase(), hash, address.trim(), 'NORMAL_USER']
    );
    const user = { id: result.insertId, name, email: email.toLowerCase(), role: 'NORMAL_USER' };
    res.status(201).json({ message: 'Signup successful', token: tokenFor(user), user });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email=?', [email]);
    if (!rows.length || !(await bcrypt.compare(password || '', rows[0].password_hash))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const user = rows[0];
    res.json({
      token: tokenFor(user),
      user: { id: user.id, name: user.name, email: user.email, role: user.role, address: user.address }
    });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/password', auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(newPassword || '')) {
    return res.status(400).json({ message: 'New password must be 8-16 chars with uppercase and special character' });
  }
  const [rows] = await pool.query('SELECT password_hash FROM users WHERE id=?', [req.user.id]);
  if (!rows.length || !(await bcrypt.compare(currentPassword || '', rows[0].password_hash))) {
    return res.status(400).json({ message: 'Current password is incorrect' });
  }
  const hash = await bcrypt.hash(newPassword, 10);
  await pool.query('UPDATE users SET password_hash=? WHERE id=?', [hash, req.user.id]);
  res.json({ message: 'Password updated successfully' });
});

module.exports = router;
