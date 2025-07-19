import { Router } from "express";
import { verifyJWT } from "../../middleware/auth";
import { getActiveHelpRequest, getAllHelpRequests, getHelpRequestCount } from "../../controllers/helpSeeker/userrequest.controller";

const router = Router();

router.get('/all-requests', verifyJWT, getAllHelpRequests);
router.get('/active-request', verifyJWT, getActiveHelpRequest);
router.get('/count-requests', verifyJWT, getHelpRequestCount);

export default router;