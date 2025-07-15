import { Router } from "express";
import { createRequest } from "../../controllers/helpRequest/request.controller";

const router = Router();

router.post('/create', createRequest);

export default router;