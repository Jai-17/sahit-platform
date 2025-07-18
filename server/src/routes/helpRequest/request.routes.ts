import { Router } from "express";
import { acceptRequestNGO, createRequest, getUserHelpRequestById, getRequestAcceptByNGO, acceptRequestUser } from "../../controllers/helpRequest/request.controller";

const router = Router();

router.post('/create', createRequest);
router.get('/user/:id', getUserHelpRequestById);
router.get('/ngo-accepted/:id', getRequestAcceptByNGO);
router.patch('/accept/ngo', acceptRequestNGO);
router.post('/accept/user', acceptRequestUser);

export default router;