import { Router } from "express";
import { verifyJWT } from "../../middleware/auth";
import { getAllHelpRequest, getHelpRequestById, getIncomingHelpRequests, ngoMarkAsResolved } from "../../controllers/ngo/ngorequest.controller";

const router = Router();

router.get('/incoming-requests', verifyJWT, getIncomingHelpRequests);
router.get('/all-requests', verifyJWT, getAllHelpRequest);
router.get('/:id', getHelpRequestById);
router.patch('/resolve-request', ngoMarkAsResolved);

export default router;