import express, { type NextFunction, type Request, type Response } from 'express';
import cors from "cors";
import { eventRouter } from './routes/event.js';
import { dataVizRouter } from './routes/dataViz.js';

export const app = express();

// allow localhost from all potential ports
// TODO: check for development environment only
// TODO: add cors for prod env
app.use(
    cors({
        origin: /^http?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
    }),
);

app.use(express.json());

app.get('/health', (req, res) => {
    return res.status(200).json({ status: "ok" });
})

/**
 * Route handlers 
 */ 
app.use('/event', eventRouter);

app.use('/data-viz', dataVizRouter);

// Handler for malformed JSON requests, should be universal to all requests
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    // console.log(err);
    if ((err as any).status === 400 && (err as any).type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'Malformed JSON' });
    }

    next(err);
})