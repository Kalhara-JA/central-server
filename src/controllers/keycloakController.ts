import { Request, Response, NextFunction, RequestHandler } from 'express';
import { createUserInKeycloakAndZammadWithQRCode } from '../services/keycloakService';

// export const createKeycloakUser: RequestHandler = async (req, res, next) => {
//     console.log('[createKeycloakUser] Request received:', req.method, req.originalUrl);
//     const { email, password } = req.body;

//     if (!email || !password) {
//         console.warn('[createKeycloakUser] Missing email or password in request body.');
//         res.status(400).json({ message: 'Email and password are required.' });
//         return;
//     }

//     try {
//         console.log('[createKeycloakUser] Creating Keycloak user for email:', email);
//         const user = await createUserInKeycloak(email, password);
//         console.log('[createKeycloakUser] Keycloak user created successfully for email:', email);
//         res.status(201).json(user);
//     } catch (error) {
//         console.error('[createKeycloakUser] Error creating Keycloak user for email:', email, error);
//         next(error);
//     }
// };

export const createKeyCloakZammadUserWithQRCode: RequestHandler = async (req, res, next) => {
    console.log('[createKeyCloakUserWithQRCode] Request received:', req.method, req.originalUrl);
    const { email, password, qrCode, firstName, lastName } = req.body;

    if (!email || !password || !qrCode) {
        console.warn('[createKeyCloakUserWithQRCode] Missing email, password or QR Code in request body.');
        res.status(400).json({ message: 'Email, password, and QR Code are required.' });
        return;
    }

    try {
        console.log('[createKeyCloakUserWithQRCode] Creating Keycloak user with QR code for email:', email);
        const user = await createUserInKeycloakAndZammadWithQRCode(email, password, qrCode, firstName, lastName);
        console.log('[createKeyCloakUserWithQRCode] Keycloak,Zammad user with QR code created successfully for email:', email);
        res.status(201).json(user);
    } catch (error) {
        console.error('[createKeyCloakUserWithQRCode] Error creating Keycloak user with QR code for email:', email, error);
        next(error);
    }
};
