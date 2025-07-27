import { Router } from "express";
import { verifyJWT } from "../../middleware/auth";
import { getActiveHelpRequest, getActiveHelpRequestDetails, getAllHelpRequests, getHelpRequestById, getHelpRequestCount, giveFeedback, helpSeekerMarkAsResolved } from "../../controllers/helpSeeker/userrequest.controller";

const router = Router();

router.get('/all-requests', verifyJWT, getAllHelpRequests);
router.get('/active-request', verifyJWT, getActiveHelpRequest);
router.get('/count-requests', verifyJWT, getHelpRequestCount);
router.get('/active-request-details', verifyJWT, getActiveHelpRequestDetails);
router.post('/feedback', verifyJWT, giveFeedback);
router.patch('/resolve-request', helpSeekerMarkAsResolved);
router.get('/help-request/:id', getHelpRequestById);

export default router;