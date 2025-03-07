import { Router } from 'express';
import { FrameworkController } from '../controllers/FrameworkController';

const router = Router();
const frameworkController = new FrameworkController();

// Rotas para frameworks
router.get('/frameworks', frameworkController.getAllFrameworks.bind(frameworkController));
router.get('/frameworks/:name', frameworkController.getFrameworkByName.bind(frameworkController));
router.post('/frameworks', frameworkController.addFramework.bind(frameworkController));
router.put('/frameworks/:name', frameworkController.updateFramework.bind(frameworkController));
router.post('/frameworks/check-updates', frameworkController.checkForUpdates.bind(frameworkController));

export default router; 