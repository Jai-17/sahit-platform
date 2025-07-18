import { Router } from "express";
import { verifyJWT } from "../../middleware/auth";
import { getIncomingHelpRequests } from "../../controllers/ngo/ngorequest.controller";

const router = Router();

router.get('/incoming-requests', verifyJWT, getIncomingHelpRequests);

export default router;