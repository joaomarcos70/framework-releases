import { Router } from 'express';
import { getAllFrameworks, getFrameworkByName, checkForUpdates, insertFrameworks } from '../controllers/FrameworkController';

const router = Router();

// Rotas para frameworks
router.get('/frameworks', getAllFrameworks);
router.get('/frameworks/:name', getFrameworkByName);
router.post('/frameworks/check-updates', checkForUpdates);
router.post('/frameworks/insert-frameworks', insertFrameworks);

export default router; 