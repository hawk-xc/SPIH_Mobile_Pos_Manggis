import validator from 'validator';
import xss from 'xss';
import pool from '../config/dbConfig.js';

const loginInputValidation = (req, res, next) => {
  const { email, password } = req.body;

  // email validation
  if (!email || email.trim() === '') {
    return res.status(400).json({
      status: 'fail',
      message: 'Email is required'
    });
  }

  if (email && !validator.isEmail(email)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid email format'
    });
  }

  // password validation
  if (!password || password.trim() === '') {
    return res.status(400).json({
      status: 'fail',
      message: 'Password is required'
    });
  }

  next();
};

const registerInputValidation = async (req, res, next) => {
  const { email, password, username } = req.body;

  // email validation
  const query = 'SELECT email FROM tb_users WHERE email = ?';
  const [rows] = await pool.query(query, [email]);

  if (rows.length > 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Email is already registered',
      version: 'tags/v1.0.0',
    });
  }

  if (!email || email.trim() === '') {
    return res.status(400).json({
      status: 'fail',
      message: 'Email is required'
    });
  }

  if (email && !validator.isEmail(email)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid email format'
    });
  }

  // password validation
  if (!password || password.trim() === '') {
    return res.status(400).json({
      status: 'fail',
      message: 'Password is required'
    });
  }

  // username validation
  if (!username || username.trim() === '') {
    return res.status(400).json({
      status: 'fail',
      message: 'Username is required'
    });
  }

  const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/; // Username must be 3-15 characters and alphanumeric
  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Username must be alphanumeric and between 3-15 characters'
    });
  }

  // anti-XSS
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key]);
      }
    }
  }

  next();
};

const passwordValidation = (req, res, next) => {
  const { password, newPassword } = req.body;

  // const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]+$/;
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;

  if (password && !passwordRegex.test(password)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Password must contain at least one letter and one number'
    });
  }

  if (newPassword && !passwordRegex.test(newPassword)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Password must contain at least one letter and one number'
    });
  }

  next();
};


const validation = { registerInputValidation, loginInputValidation, passwordValidation };

export default validation;
