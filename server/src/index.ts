import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

/* ROUTE IMPORTS HELP SEEKER */
import authRoutes from './routes/helpSeeker/auth.routes';
import userRoutes from './routes/helpSeeker/user.routes';
import requestUserRoutes from './routes/helpSeeker/userrequest.routes';

/* ROUTE IMPORTS HELP REQUEST */
import createRoutes from './routes/helpRequest/request.routes';
import awardRoutes from './routes/helpRequest/awards.routes'

/* ROUTE IMPORTS NGOS */
import userNGORoutes from './routes/ngo/user.routes';
import authNGORoutes from './routes/ngo/auth.routes';
import requestNGORoutes from './routes/ngo/ngorequest.route';

/* ROUTE IMPORTS CHAT */
import chatRoutes from './routes/chat/chat.routes';

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(cors({origin: true, credentials: true}));

app.get("/", (_, res) => {
    res.json({message: "Server is running!"});
})

// Chat Routes
app.use('/api/v1/chat', chatRoutes);

// Help Seeker Routes
app.use('/api/v1/help/auth', authRoutes);
app.use('/api/v1/help/user', userRoutes);
app.use('/api/v1/help/request', requestUserRoutes);

// Help Request Routes
app.use('/api/v1/request', createRoutes);
app.use('/api/v1/awards', awardRoutes);

// NGO Request Routes
app.use('/api/v1/ngo/user', userNGORoutes);
app.use('/api/v1/ngo/auth', authNGORoutes);
app.use('/api/v1/ngo/request', requestNGORoutes);

const port = Number(process.env.PORT) || 8000;
app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
})