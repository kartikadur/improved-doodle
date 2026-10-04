import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "./event.js";

export const dataVizRouter = Router();

/**
 * Frontend Requests
 */
dataVizRouter.get('/levels-completed', async (req: Request, res: Response) => {

    const levelSnapshot = await db.collection('levelStats').get();

    const levels = levelSnapshot.docs.map(l => l.data());

    const data = levels.map((data, level) => ({ level: level + 1, users: data.uniqueCompletions }));

    return res.status(200).json(data);
})
dataVizRouter.get('/levels-duration', async (req: Request, res: Response) => {

    const levelSnapshot = await db.collection('levelStats').get()

    const levels = levelSnapshot.docs.map(l => l.data());

    const data = levels.map((data, level) => ({ level: level + 1, best: data.minDurationMs, worst: data.maxDurationMs }));

    return res.status(200).json(data);
})
dataVizRouter.get('/game-ended', async (req: Request, res: Response) => {

    const gameSnapshot = await db.collection('gameStats').doc('summary').get();

    const reasons = gameSnapshot.data()?.reason ?? {};

    const data = Object.keys(reasons).map(key => ({ category: key, share: reasons[key] }));

    return res.status(200).json(data);
})