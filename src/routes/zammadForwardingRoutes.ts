// src/routes/zammadRoutes.ts

import { Router } from 'express';
import { validateToken } from '../services/keycloakService';
import { forwardToZammad } from '../services/zammadService';
// import * as openFgaService from '../services/openFgaService';

const router = Router();

router.use('/*', async (req, res) => {
    try {
        // Validate authorization header
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            res.status(401).json({ error: 'Authorization header missing' });
            return;
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'Bearer token missing' });
        }

        // Validate token and check permissions
        const user = await validateToken(token);
        console.log('Validated user:', user);

        //this should be replace with new family app check permission
        // const hasPermission = await openFgaService.checkPermission(user.email, 'app:zammad', 'customer');
        // if (!hasPermission) {
        //     return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        // }

        // Set up authentication for Zammad
        const password = 'password';
        const basicAuth = Buffer.from(`${user.email}:${password}`).toString('base64');

        // Check if this is a file attachment request
        const isFileRequest = req.path.includes('/ticket_attachment/');

        // Prepare headers
        const headers = {
            Authorization: `Basic ${basicAuth}`,
            ...(!isFileRequest && { 'Content-Type': 'application/json' }),
        };

        // Remove the API prefix from the URL
        const trimmedUrl = req.originalUrl.replace('/api/v1/zammad', '');

        // Forward the request to Zammad
        const response = await forwardToZammad(
            trimmedUrl,
            req.method,
            req.body,
            headers,
            isFileRequest
        );

        // Set response headers
        Object.entries(response.headers).forEach(([key, value]: any) => {
            if (value) res.set(key, value);
        });

        // Handle the response appropriately based on the request type
        if (isFileRequest) {
            res.status(response.status);
            res.end(response.data);
        } else {
            res.status(response.status).json(response.data);
        }
    } catch (error: any) {
        console.error('Error in API route:', error);
        const { status = 500, headers = {}, message = 'Internal Server Error' } = error;
        res.set(headers);
        res.status(status).json({ error: message });
    }
});

export default router;