const db = require('../utils/database');

// Verify token (Cognito handles auth)
const verify = async (req, res) => {
  try {
    // User info is already verified by middleware
    const user = req.user;

    // Check if user exists in our database
    let dbUser = await db.getOne(
      'SELECT * FROM user_account WHERE cognito_sub = $1',
      [user.sub]
    );

    if (!dbUser) {
      // Create user record if doesn't exist
      const result = await db.insert(
        `INSERT INTO user_account (
          cognito_sub, university_email, full_name, account_type, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *`,
        [user.sub, user.email, user.username || user.email, user.accountType || 'student']
      );
      dbUser = result;
    }

    res.json({
      status: 'success',
      message: 'Token verified successfully',
      data: {
        user: {
          id: dbUser.account_id,
          email: dbUser.university_email,
          fullName: dbUser.full_name,
          accountType: dbUser.account_type
        }
      }
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to verify token',
      data: null
    });
  }
};

// Logout (client-side token removal)
const logout = async (req, res) => {
  res.json({
    status: 'success',
    message: 'Logged out successfully',
    data: null
  });
};

    // Create user account
    const userAccount = await db.insert(
      `INSERT INTO user_account 
       (university_email, account_type, password_hash, email_verified, account_status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING account_id, university_email, account_type, created_at`,
      [email, account_type, hashedPassword, false, 'active']
    );

    // Create user profile based on type
    if (account_type === 'student' && full_name) {
      await db.insert(
        `INSERT INTO student 
         (account_id, full_name, university_email, contact, faculty)
         VALUES ($1, $2, $3, $4, $5)`,
        [userAccount.account_id, full_name, email, contact, faculty]
      );
    }

    // Generate token
    const token = generateToken({
      account_id: userAccount.account_id,
      university_email: userAccount.university_email,
      account_type: userAccount.account_type,
      full_name
    });

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          account_id: userAccount.account_id,
          email: userAccount.university_email,
          account_type: userAccount.account_type,
          full_name
        },
        token
      }
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

// User login
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

    // Get user account
    const userAccount = await db.getOne(
      `SELECT account_id, university_email, password_hash, account_type, account_status
       FROM user_account
       WHERE university_email = $1`,
      [email]
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

    // Verify password
    const passwordMatch = await bcryptjs.compare(password, userAccount.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
        data: null
      });
    }

    // Get user profile
    let userProfile = {};
    if (userAccount.account_type === 'student') {
      userProfile = await db.getOne(
        'SELECT student_id, full_name, contact, faculty FROM student WHERE account_id = $1',
        [userAccount.account_id]
      );
    }

    // Update last login
    await db.update(
      `UPDATE user_account SET last_login = NOW() WHERE account_id = $1 RETURNING *`,
      [userAccount.account_id]
    );

    // Generate token
    const token = generateToken({
      account_id: userAccount.account_id,
      university_email: userAccount.university_email,
      account_type: userAccount.account_type,
      full_name: userProfile.full_name
    });

    res.json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          account_id: userAccount.account_id,
          email: userAccount.university_email,
          account_type: userAccount.account_type,
          full_name: userProfile.full_name || '',
          contact: userProfile.contact || ''
        },
        token
      }
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

// Logout
const logout = async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // Here we just send a success response
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

// Verify token
const verify = async (req, res) => {
  try {
    const user = req.user;
    
    // Get fresh user data
    const userAccount = await db.getOne(
      `SELECT account_id, university_email, account_type, account_status
       FROM user_account
       WHERE account_id = $1`,
      [user.sub]
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
