import { Router } from "express";
import { approveNGO, getAllNgos, getNGOById, ngoDashboardStat, registerNGO } from "../../controllers/ngo/user.controller";
import { verifyJWT } from "../../middleware/auth";

const router = Router();

router.get('/get-ngos', getAllNgos);
router.post('/register-ngo', verifyJWT, registerNGO);
router.get('/getUserById/:id', getNGOById);
router.patch('/admin-approve', approveNGO);
router.get('/db-stat', verifyJWT, ngoDashboardStat);

export default router;