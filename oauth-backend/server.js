// server.js (fixed)
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import cors from 'cors';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { Strategy as FacebookStrategy } from 'passport-facebook';


dotenv.config();
const app = express();

// Basic middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Session (must be before passport.session and before routes that call req.login)
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
  }
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// MySQL pool (create before strategies)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'oauth_demo',
  waitForConnections: true,
  connectionLimit: 10,
});

// Local strategy for email/password
passport.use('local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    console.log("Local login attempt for:", email);
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND provider = ?', [email, 'local']);
    console.log("DB rows length:", rows.length);

    if (rows.length === 0) {
      console.log("LocalStrategy: user not found");
      return done(null, false, { message: 'User not found' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash || '');
    console.log("Password match:", match);

    if (!match) {
      return done(null, false, { message: 'Invalid password' });
    }

    return done(null, { id: user.id, name: user.name, email: user.email, provider: user.provider });
  } catch (err) {
    console.error("LocalStrategy error:", err);
    return done(err);
  }
}));

// Passport Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    if (!email) return done(new Error('No email found in Google profile'), null);

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      const [insertResult] = await pool.query(
        'INSERT INTO users (google_id, name, email, provider, access_token) VALUES (?, ?, ?, ?, ?)',
        [profile.id, profile.displayName, email, 'google', accessToken]
      );
      const [newRows] = await pool.query('SELECT id, name, email, provider FROM users WHERE id = ?', [insertResult.insertId]);
      return done(null, newRows[0]);
    } else {
      await pool.query('UPDATE users SET access_token = ? WHERE id = ?', [accessToken, rows[0].id]);
      return done(null, { id: rows[0].id, name: rows[0].name, email: rows[0].email, provider: rows[0].provider });
    }
  } catch (err) {
    console.error("GoogleStrategy error:", err);
    return done(err, null);
  }
}));

// Serialize / Deserialize
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, provider FROM users WHERE id = ?', [id]);
    done(null, rows[0] || null);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['id', 'displayName', 'emails']  // important: to get email
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value || null;

    // Check if user exists
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ? AND provider = ?', [email, 'facebook']);

    if (rows.length === 0) {
      const [insertResult] = await pool.query(
        'INSERT INTO users (google_id, name, email, provider, access_token) VALUES (?, ?, ?, ?, ?)',
        [profile.id, profile.displayName, email, 'facebook', accessToken]
      );
      const [newRows] = await pool.query('SELECT id, name, email, provider FROM users WHERE id = ?', [insertResult.insertId]);
      return done(null, newRows[0]);
    } else {
      // Update token if user already exists
      await pool.query('UPDATE users SET access_token = ? WHERE id = ?', [accessToken, rows[0].id]);
      return done(null, { id: rows[0].id, name: rows[0].name, email: rows[0].email, provider: rows[0].provider });
    }
  } catch (err) {
    return done(err, null);
  }
}));



// ---------- Routes ----------

// Local registration
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, dob } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing required fields' });

    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, provider, password_hash, dob) VALUES (?, ?, ?, ?, ?)',
      [name, email, 'local', password_hash, dob || null]
    );

    const userObj = { id: result.insertId, name, email, provider: 'local' };

    req.login(userObj, (err) => {
      if (err) {
        console.error("req.login after register error:", err);
        return res.status(500).json({ message: 'Login after register failed' });
      }
      return res.json({ ok: true, user: userObj });
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Local login
app.post('/auth/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error("Auth error:", err);
      return res.status(500).json({ message: 'Auth error' });
    }
    if (!user) {
      console.log("Login failed:", info);
      return res.status(401).json({ message: info?.message || 'Login failed' });
    }
    req.login(user, (err) => {
      if (err) {
        console.error("req.login error:", err);
        return res.status(500).json({ message: 'Login error' });
      }
      return res.json({ ok: true, user });
    });
  })(req, res, next);
});

// Google OAuth endpoints
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: process.env.FRONTEND_URL || 'http://localhost:5173' }),
  (req, res) => {
    res.redirect((process.env.FRONTEND_URL || 'http://localhost:5173') + '/dashboard');
  }
);

// Facebook Auth
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: process.env.FRONTEND_URL || 'http://localhost:5173' }),
  (req, res) => {
    res.redirect((process.env.FRONTEND_URL || 'http://localhost:5173') + '/dashboard');
  }
);


// API to get current user
app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ user: null });
  }
});

// Logout
app.post('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.clearCookie('connect.sid');
    res.json({ ok: true });
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running: http://localhost:${PORT}`));
