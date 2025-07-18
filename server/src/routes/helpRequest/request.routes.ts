import { Router } from "express";
import { acceptRequestNGO, createRequest, getUserHelpRequestById, getRequestAcceptByNGO, acceptRequestUser } from "../../controllers/helpRequest/request.controller";
import { verifyJWT } from "../../middleware/auth";

const router = Router();

router.post('/create', createRequest);
router.get('/user/:id', getUserHelpRequestById);
router.get('/ngo-accepted', verifyJWT, getRequestAcceptByNGO);
router.patch('/accept/ngo', verifyJWT, acceptRequestNGO);
router.post('/accept/user', acceptRequestUser);

export default router;