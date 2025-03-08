import { Router } from 'express';
import { createUserInZammad, getUserByEmailFromZammad } from '../controllers/zammadController';

const router = Router();

router.post('/create-user', createUserInZammad);
router.get('/users/:email', getUserByEmailFromZammad);