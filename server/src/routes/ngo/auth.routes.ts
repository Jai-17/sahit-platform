import { Router } from "express";
import { getUser, oauthSync, refreshAccessToken, resendOtp, signIn, signUp, updateNGOProfile, verifyEmail } from "../../controllers/ngo/auth.controller";
import { verifyJWT } from "../../middleware/auth";

const router = Router();

router.post('/signin', signIn);
router.post('/signup', signUp);
router.get('/verify-otp', verifyEmail);
router.post('/resend-otp', resendOtp);
router.post('/oauth-sync', oauthSync);
router.post('/refresh-token', refreshAccessToken);
router.get('/getuser', verifyJWT, getUser);
router.patch('/update-user', verifyJWT, updateNGOProfile);

export default router;