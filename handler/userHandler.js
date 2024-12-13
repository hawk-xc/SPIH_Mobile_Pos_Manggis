// require('dotenv').config();
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../config/dbConfig.js';
import formattedDate from '../config/timezoneConfig.js';
import dotenv from 'dotenv';
dotenv.config();
import { nanoid } from 'nanoid';

/**
 * Base URL handler
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with status, message, and version
 */
const baseUrlHandler = (req, res) => {
  res.status(200).json({
    status: 'success',
    message:
      'SPIH POS MANGGIS APIs SERVICE',
  });
};

/**
 * Handles when user input incorrect URL
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with status, message, and version
 */
const missingUrlHandler = (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    version: 'tags/v1.0.0',
  });
};

/**
 * Handles user login
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with status, message, token, and version
 */
const loginHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const query =
      'SELECT id, unique_id, email, username, password, created_at FROM tb_users WHERE email = ?';
    const [rows] = await pool.query(query, [email]);

    const user = rows[0];

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'user not found!',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid password',
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        uniqueId: user.unique_id,
        email: user.email,
        createdAt: user.created_at,
      },
      process.env.JWT_TOKEN || 'AB5TRACT',
      { expiresIn: process.env.JWT_TOKEN_EXPIRATION || '1d' }
    );

    console.log(token);

    res.json({
      status: 'success',
      message: 'User logged in successfully',
      token: token,
    });
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    res.status(401).json({
      status: 'fail',
      message: 'Unauthorized!',
    });
  }
};

/**
 * Handles register endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
const registerHandler = async (req, res) => {
  const { email, username, password } = req.body;
  const uniqueId = nanoid(16);

  try {
    const hashedPassword = await bcrypt.hashSync(password, 10);
    const query =
      'INSERT INTO tb_users (unique_id, username, email, password, created_at) value (?, ?, ?, ?, ?)';
    await pool.query(query, [
      uniqueId,
      username,
      email,
      hashedPassword,
      formattedDate(),
    ]);

    res.status(200).json({
      status: 'success',
      message: 'User registered successfully, you can login using /login',
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: `error: ${error}`,
    });
  }
};

/**
 * Handles /profile endpoint
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with status, message, and user data
 */
const profileHandler = async (req, res) => {
  const user = req.user;

  try {
    const query = 'SELECT unique_id, email, username, created_at FROM tb_users WHERE unique_id = ?';
    const [rows] = await pool.query(query, [user.uniqueId]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'user not found!',
      });
    }

    res.status(200).json({
      status: 'success',
      data: rows,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: `error: ${error}`,
    });
  }
};

/**
 * Handles /profile endpoint for update user profile
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with status, message, and user data
 * @description
 * This endpoint is used to update user profile.
 * The name, username, and address will be provided in the request body.
 * The data will be filtered by the user id in the request header.
 * The response will contain the updated user data.
 */
const updateProfileHandler = async (req, res) => {
  const { name, username, address } = req.body;
  const user = req.user;

  try {
    const selectQuery = 'SELECT name, username, address FROM tb_users WHERE unique_id = ?';
    const [currentData] = await pool.query(selectQuery, [user.uniqueId]);

    if (currentData.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'user not found!',
        version: 'tags/v1.0.0',
      });
    }

    const updatedName = name ?? currentData[0].name;
    const updatedUsername = username ?? currentData[0].username;
    const updatedAddress = address ?? currentData[0].address;

    const updateQuery = `
      UPDATE tb_users
      SET name = ?, username = ?, address = ?
      WHERE unique_id = ?`;
    const [rows] = await pool.query(updateQuery, [
      updatedName,
      updatedUsername,
      updatedAddress,
      user.uniqueId,
    ]);

    if (rows.affectedRows === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'user not found!',
        version: 'tags/v1.0.0',
      });
    }

    if (rows.changedRows === 0) {
      return res.status(200).json({
        status: 'success',
        message: 'No changes made, data is already up-to-date.',
        version: 'tags/v1.0.0',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      version: 'tags/v1.0.0',
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: `error: ${error.message}`,
      version: 'tags/v1.0.0',
    });
  }
};

/**
 * Handles /profile/changepassword endpoint
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with status, message, and user data
 * @description
 * This endpoint is used to change the password of the user.
 * The user id is provided in the request header.
 * The old password and new password will be provided in the request body.
 * The response will contain the updated user data.
 */
const changePasswordHandler = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = req.user;

  try {
    const query = 'SELECT password FROM tb_users WHERE unique_id = ?';
    const [rows] = await pool.query(query, [user.uniqueId]);

    if (rows.length === 0) {
      return res.status(404).json({
        status: 'fail',
        message: 'user not found!',
        version: 'tags/v1.0.0',
      });
    }

    const hashedPassword = rows[0].password;

    if (!bcrypt.compareSync(oldPassword, hashedPassword)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Old password is incorrect!',
        version: 'tags/v1.0.0',
      });
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hashedNewPassword = bcrypt.hashSync(newPassword, salt);

      const updateQuery = 'UPDATE tb_users SET password = ? WHERE unique_id = ?';
      const [result] = await pool.query(updateQuery, [hashedNewPassword, user.uniqueId]);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          status: 'fail',
          message: 'user not found!',
          version: 'tags/v1.0.0',
        });
      }
    }

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully',
      version: 'tags/v1.0.0',
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: `error: ${error.message}`,
      version: 'tags/v1.0.0',
    });
  }
};


const userHandler = {
  missingUrlHandler,
  baseUrlHandler,
  loginHandler,
  registerHandler,
  profileHandler,
  updateProfileHandler,
  changePasswordHandler
};

export default userHandler;
