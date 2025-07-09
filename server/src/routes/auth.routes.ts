import { Router } from "express";
import { oauthSync, resendOtp, signIn, signUp, verifyEmail } from "../controllers/auth.controller";

const router = Router();

router.post("/signin", signIn)
router.post("/signup", signUp)
router.get('/verify-otp', verifyEmail)
router.post('/resend-otp', resendOtp)
// router.get('/forgot-password')
// router.patch('/reset-password')
router.post('/oauth-sync', oauthSync)
// router.get('/logout')

export default router;