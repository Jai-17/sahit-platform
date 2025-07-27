import { Router } from "express";
import { acceptRequestNGO, createRequest, getUserHelpRequestById, getRequestAcceptByNGO, acceptRequestUser, getAdminStats, declineRequestUser, declineRequestNGO, deleteRequest } from "../../controllers/helpRequest/request.controller";
import { verifyJWT } from "../../middleware/auth";

const router = Router();

router.post('/create', verifyJWT, createRequest);
router.get('/user/:id', getUserHelpRequestById);
router.get('/ngo-accepted', verifyJWT, getRequestAcceptByNGO);
router.patch('/accept/ngo', verifyJWT, acceptRequestNGO);
router.post('/decline/ngo', verifyJWT, declineRequestNGO);
router.post('/accept/user', acceptRequestUser);
router.post('/decline/user', declineRequestUser);
router.get('/admin-stats', getAdminStats);
router.delete('/delete/:requestId', verifyJWT, deleteRequest);


export default router;