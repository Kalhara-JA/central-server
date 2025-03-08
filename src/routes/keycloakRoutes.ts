import { Router } from 'express';
import { createKeyCloakZammadUserWithQRCode } from '../controllers/keycloakController';

const router = Router();

// /**
//  * @route POST /keycloak/users
//  * @desc Create a new user in Keycloak with the provided email and password.
//  * @access Public (or restrict as needed)
//  */
// router.post('/users', createKeycloakUser);

//create user in keycloak with qrcode
/**
 * @route POST /keycloak/users/qrcode
 * @desc Create a new user in Keycloak with the provided email,password and qrcode.
 * @access Public (or restrict as needed)
 */
router.post('/users/qrcode', createKeyCloakZammadUserWithQRCode);

export default router;
