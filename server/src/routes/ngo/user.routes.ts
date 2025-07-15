import { Router } from "express";
import { getAllNgos, registerNGO } from "../../controllers/ngo/user.controller";

const router = Router();

router.get('/get-ngos', getAllNgos);
router.post('/register-ngo', registerNGO);

export default router;