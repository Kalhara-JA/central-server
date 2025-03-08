import { Router } from 'express';
import { getUserByEmail, registerUser } from '../controllers/userController';

const router = Router();

router.get('/:email', getUserByEmail);
router.post('/', registerUser);

export default router;
