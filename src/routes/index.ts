import { Router } from 'express';
import userRoutes from './userRoutes';
import qrCodeRoutes from './qrCodeRoutes';
import keycloakRoutes from './keycloakRoutes';
import appsRoutes from './appsRoutes';
import zammadForwardingRoutes from './zammadForwardingRoutes';

const router = Router();

router.use('/users', userRoutes);
router.use('/qrcodes', qrCodeRoutes);
router.use('/keycloak', keycloakRoutes);
router.use('/apps', appsRoutes);
router.use('/zammad/forward', zammadForwardingRoutes);

export default router;
