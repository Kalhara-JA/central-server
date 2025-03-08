import { RequestHandler } from "express";
import { createUserInZammadService, findUserByEmailFromZammad } from "../services/zammadService";

export const createUserInZammad: RequestHandler = async (req, res, next) => {
    console.log('[createUserInZammad] Request received:', req.method, req.originalUrl);
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
        console.warn('[createUserInZammad] Missing email or password in request body.');
        res.status(400).json({ message: 'Email and password are required.' });
        return;
    }

    try {
        console.log('[createUserInZammad] Creating Zammad user for email:', email);
        const user = await createUserInZammadService(email, password, firstName, lastName);
        console.log('[createUserInZammad] Zammad user created successfully for email:', email);
        res.status(201).json(user);
    } catch (error) {
        console.error('[createUserInZammad] Error creating Zammad user for email:', email, error);
        next(error);
    }
}

export const getUserByEmailFromZammad: RequestHandler = async (req, res, next) => {
    console.log('[getUserByEmailFromZammad] Request received:', req.method, req.originalUrl);
    const { email } = req.params;

    try {
        console.log('[getUserByEmailFromZammad] Looking up user by email:', email);
        const user = await findUserByEmailFromZammad(email);
        if (!user) {
            console.warn('[getUserByEmailFromZammad] User not found for email:', email);
            res.status(404).json({ message: 'User not found' });
            return;
        }
        console.log('[getUserByEmailFromZammad] User found for email:', email);
        res.json(user);
    } catch (error) {
        console.error('[getUserByEmailFromZammad] Error retrieving user by email:', email, error);
        next(error);
    }
}