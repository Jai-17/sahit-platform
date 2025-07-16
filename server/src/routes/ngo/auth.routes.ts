import { Router } from "express";
import { getUser, oauthSync, refreshAccessToken, resendOtp, signIn, signUp, verifyEmail } from "../../controllers/ngo/auth.controller";

const router = Router();

router.post('/signin', signIn);
router.post('/signup', signUp);
router.get('/verify-otp', verifyEmail);
router.post('/resend-otp', resendOtp);
router.post('/oauth-sync', oauthSync);
router.post('/refresh-token', refreshAccessToken);
router.get('/getuser', getUser);

export default router;