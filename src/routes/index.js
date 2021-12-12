import { Router } from 'express';
import authRoutes from './auth.route';

const router = Router();

router.get('/', (req, res) => res.send('Nikahan Server'));
router.use('/auth', authRoutes);

export default router;
