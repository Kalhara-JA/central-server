import { Router } from 'express';
import { generateQRCodeByEmail, getUserQRCodes } from '../controllers/qrCodeController';

const router = Router();

/**
 * @swagger
 * /qrcodes/generate:
 *   post:
 *     summary: Create a QR Code for a user.
 *     tags:
 *       - QR Codes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               qrCode:
 *                 type: string
 *             required:
 *               - email
 *               - qrCode
 *     responses:
 *       201:
 *         description: QR Code created successfully.
 *       400:
 *         description: Email or QR Code is missing.
 *       500:
 *         description: Server error.
 */
router.post('/generate', generateQRCodeByEmail);

/**
 * @swagger
 * /qrcodes/{email}:
 *   get:
 *     summary: Retrieve all QR Codes associated with a user.
 *     tags:
 *       - QR Codes
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: User's email
 *     responses:
 *       200:
 *         description: A list of QR Codes.
 *       500:
 *         description: Server error.
 */
router.get('/:email', getUserQRCodes);

export default router;
