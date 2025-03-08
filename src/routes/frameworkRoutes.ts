import { Router } from 'express';
import { checkForUpdates, getAllFrameworks, 
    getFrameworkByName, 
    insertFrameworks, 
    updateFramework, 
    updateManyFrameworks
} from '../controllers/FrameworkController';
import { decodeToken } from '../middlewares/decode-token';

const router = Router();


router.get('/frameworks', getAllFrameworks);
router.get('/frameworks/:name', getFrameworkByName);
router.post('/frameworks/insert-many', insertFrameworks);
router.put('/frameworks/:name', decodeToken, updateFramework);
router.put('/frameworks/update-many', decodeToken, updateManyFrameworks);
router.post('/frameworks/check-updates', checkForUpdates);

export default router; 