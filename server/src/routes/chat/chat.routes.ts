import {Router} from 'express';
import { verifyJWT } from '../../middleware/auth';
import { chatJwt, getChatRoomById, sendChat, startChat } from '../../controllers/chat/chat.controller';

const router = Router();

router.post('/token', verifyJWT, chatJwt);
router.post('/start', verifyJWT, startChat);
router.get('/messages/:chatRoomId', verifyJWT, getChatRoomById);
router.post('/send', verifyJWT, sendChat);

export default router;