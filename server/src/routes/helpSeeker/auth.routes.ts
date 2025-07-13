import { Router } from "express";
import { oauthSync, refreshAccessToken, registerHelpSeeker, resendOtp, signIn, signUp, verifyEmail } from "../../controllers/helpSeeker/auth.controller";
import { verifyJWT } from "../../middleware/auth";

const router = Router();

router.post("/signin", signIn)
router.post("/signup", signUp)
router.get('/verify-otp', verifyEmail)
router.post('/resend-otp', resendOtp)
// router.get('/forgot-password')
// router.patch('/reset-password')
router.post('/oauth-sync', oauthSync)
// router.get('/logout')
router.post('/refresh-token', refreshAccessToken);
router.post('/help-seeker-register', verifyJWT, registerHelpSeeker);

export default router;