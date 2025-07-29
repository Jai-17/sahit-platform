import {Router} from 'express';
import { changeAwardStatus, createAward, getAwardDetailsById, getAwardsByRole } from '../../controllers/helpRequest/awards.controller';
import { verifyJWT } from '../../middleware/auth';

const router = Router();

router.post('/create', verifyJWT, createAward);
router.get('/getAll/:role', getAwardsByRole);
router.get('/getAward/:id', getAwardDetailsById);
router.patch('/update/:id', changeAwardStatus);

export default router;