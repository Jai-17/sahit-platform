import {Router} from 'express';
import { changeAwardStatus, createAward, getAwardDetailsById, getAwardsByRole, getAwardStatusById } from '../../controllers/helpRequest/awards.controller';
import { verifyJWT } from '../../middleware/auth';

const router = Router();

router.post('/create', verifyJWT, createAward);
router.get('/getAll', getAwardsByRole);
router.get('/getAward/:id', getAwardDetailsById);
router.patch('/update/:id', changeAwardStatus);
router.get('/status', verifyJWT, getAwardStatusById);

export default router;