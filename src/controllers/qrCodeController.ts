import { Request, Response, NextFunction, RequestHandler } from 'express';
import { createQRCodeForUser, getQRCodesByEmail } from '../services/qrCodeService';

export const generateQRCodeByEmail: RequestHandler = async (req, res, next) => {
    console.log('[generateQRCodeByEmail] Request received:', req.method, req.originalUrl);
    const { email, qrCode, password } = req.body;

    if (!email || !qrCode) {
        console.warn('[generateQRCodeByEmail] Missing email or QR Code in request body.');
        res.status(400).json({ message: 'Email and QR Code are required.' });
        return;
    }

    try {
        console.log('[generateQRCodeByEmail] Creating QR code for email:', email);
        const createdQRCode = await createQRCodeForUser(email, qrCode, password);
        console.log('[generateQRCodeByEmail] QR code created successfully for email:', email);
        res.status(201).json(createdQRCode);
    } catch (error) {
        console.error('[generateQRCodeByEmail] Error creating QR code for email:', email, error);
        next(error);
    }
};

export const getUserQRCodes: RequestHandler = async (req, res, next) => {
    console.log('[getUserQRCodes] Request received:', req.method, req.originalUrl);
    const { email } = req.params;

    try {
        console.log('[getUserQRCodes] Retrieving QR codes for email:', email);
        const qrCodes = await getQRCodesByEmail(email);
        console.log('[getUserQRCodes] Retrieved', qrCodes.length, 'QR codes for email:', email);
        res.json(qrCodes);
    } catch (error) {
        console.error('[getUserQRCodes] Error retrieving QR codes for email:', email, error);
        next(error);
    }
};
