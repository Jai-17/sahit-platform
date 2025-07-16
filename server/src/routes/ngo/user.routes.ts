import { Router } from "express";
import { getAllNgos, registerNGO } from "../../controllers/ngo/user.controller";
import { verifyJWT } from "../../middleware/auth";

const router = Router();

router.get('/get-ngos', getAllNgos);
router.post('/register-ngo', verifyJWT, registerNGO);

export default router;