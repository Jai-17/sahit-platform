import { Router } from "express";
import { approveHelpSeeker, getAllHelpSeekers, getHelpSeekerById } from "../../controllers/helpSeeker/user.controller";

const router = Router();

router.get('/getAllUsers', getAllHelpSeekers);
router.patch('/admin-approve', approveHelpSeeker);
router.get('/getUserById/:id', getHelpSeekerById);

export default router;