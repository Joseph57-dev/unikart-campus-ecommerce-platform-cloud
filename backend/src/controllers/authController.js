const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../utils/database');
const config = require('../config');

const generateToken = ({ account_id, university_email, account_type }) => {
  const secret = config.jwtSecret;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(
    {
      sub: String(account_id),
      email: university_email,
      accountType: account_type
    },
    secret,
    { expiresIn: config.jwtExpire || '7d' }
  );
};

const register = async (req, res) => {
  try {
    const { email, password, full_name, account_type, faculty, contact } = req.body;

    if (!email || !password || !account_type) {
      return res.status(400).json({
        status: 'error',
        message: 'Email, password, and account type are required',
        data: null
      });
    }

    const allowed = ['student', 'vendor', 'dean', 'admin'];
    if (!allowed.includes(account_type)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid account type',
        data: null
      });
    }

    if (account_type === 'student' && !full_name) {
      return res.status(400).json({
        status: 'error',
        message: 'Full name is required for student accounts',
        data: null
      });
    }

    const emailNorm = String(email).trim().toLowerCase();

    const existing = await db.getOne(
      'SELECT account_id FROM user_account WHERE LOWER(university_email) = $1',
      [emailNorm]
    );

    if (existing) {
      return res.status(409).json({
        status: 'error',
        message: 'Email already registered',
        data: null
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const userAccount = await db.insert(
      `INSERT INTO user_account
       (university_email, account_type, password_hash, email_verified, account_status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING account_id, university_email, account_type, created_at`,
      [emailNorm, account_type, hashedPassword, false, 'active']
    );

    if (account_type === 'student') {
      await db.insert(
        `INSERT INTO student
         (account_id, full_name, university_email, contact, faculty)
         VALUES ($1, $2, $3, $4, $5)`,
        [userAccount.account_id, full_name, emailNorm, contact || null, faculty || null]
      );
    }

    const token = generateToken({
      account_id: userAccount.account_id,
      university_email: userAccount.university_email,
      account_type: userAccount.account_type
    });

    const user = {
      account_id: userAccount.account_id,
      email: userAccount.university_email,
      account_type: userAccount.account_type,
      full_name: full_name || ''
    };

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      token,
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Registration failed: ' + error.message,
      data: null
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required',
        data: null
      });
    }

    const emailNorm = String(email).trim().toLowerCase();

    const userAccount = await db.getOne(
      `SELECT account_id, university_email, password_hash, account_type, account_status
       FROM user_account
       WHERE LOWER(university_email) = $1`,
      [emailNorm]
    );

    if (!userAccount) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
        data: null
      });
    }

    if (userAccount.account_status === 'locked' || userAccount.account_status === 'suspended') {
      return res.status(403).json({
        status: 'error',
        message: 'Account is suspended or locked',
        data: null
      });
    }

    const passwordMatch = await bcryptjs.compare(password, userAccount.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
        data: null
      });
    }

    let userProfile = {};
    if (userAccount.account_type === 'student') {
      userProfile = await db.getOne(
        'SELECT student_id, full_name, contact, faculty FROM student WHERE account_id = $1',
        [userAccount.account_id]
      );
    }

    await db.update(
      `UPDATE user_account SET last_login = NOW() WHERE account_id = $1 RETURNING *`,
      [userAccount.account_id]
    );

    const token = generateToken({
      account_id: userAccount.account_id,
      university_email: userAccount.university_email,
      account_type: userAccount.account_type
    });

    const user = {
      account_id: userAccount.account_id,
      email: userAccount.university_email,
      account_type: userAccount.account_type,
      full_name: userProfile?.full_name || '',
      contact: userProfile?.contact || ''
    };

    res.json({
      status: 'success',
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Login failed: ' + error.message,
      data: null
    });
  }
};

const logout = async (req, res) => {
  try {
    res.json({
      status: 'success',
      message: 'Logged out successfully',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Logout failed: ' + error.message,
      data: null
    });
  }
};

const verify = async (req, res) => {
  try {
    const user = req.user;

    const accountId = Number.parseInt(String(user.sub), 10);

    const userAccount = await db.getOne(
      `SELECT account_id, university_email, account_type, account_status
       FROM user_account
       WHERE account_id = $1`,
      [accountId]
    );

    if (!userAccount) {
      return res.status(401).json({
        status: 'error',
        message: 'User not found',
        data: null
      });
    }

    res.json({
      status: 'success',
      message: 'Token is valid',
      data: {
        user: {
          account_id: userAccount.account_id,
          email: userAccount.university_email,
          account_type: userAccount.account_type
        }
      }
    });
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Token verification failed: ' + error.message,
      data: null
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  verify
};
