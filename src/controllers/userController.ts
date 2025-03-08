import { Request, Response, NextFunction, RequestHandler } from 'express';
import { findUserByEmail, createUser } from '../services/userService';

export const getUserByEmail: RequestHandler = async (req, res, next) => {
  console.log('[getUserByEmail] Request received:', req.method, req.originalUrl);
  const { email } = req.params;
  try {
    console.log('[getUserByEmail] Looking up user by email:', email);
    const user = await findUserByEmail(email);
    if (!user) {
      console.warn('[getUserByEmail] User not found for email:', email);
      res.status(404).json({ message: 'User not found' });
      return;
    }
    console.log('[getUserByEmail] User found for email:', email);
    res.json(user);
  } catch (error) {
    console.error('[getUserByEmail] Error retrieving user by email:', email, error);
    next(error);
  }
};

export const registerUser: RequestHandler = async (req, res, next) => {
  console.log('[registerUser] Request received:', req.method, req.originalUrl);
  const { email, name } = req.body;
  try {
    console.log('[registerUser] Registering user with email:', email);
    const user = await createUser(email, name);
    console.log('[registerUser] User registered successfully for email:', email);
    res.status(201).json(user);
  } catch (error) {
    console.error('[registerUser] Error registering user with email:', email, error);
    next(error);
  }
};
