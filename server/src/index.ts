import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

/* ROUTE IMPORTS */
import authRoutes from './routes/auth.routes';

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(cors());

app.get("/", (req, res) => {
    res.json({message: "Server is running!"});
})

// Help Seeker Routes
app.use('/api/v1/auth', authRoutes);

const port = Number(process.env.PORT) || 8000;
app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
})