import 'dotenv/config';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { validateBodyForEvents } from '../validators/event.js';
import { eventSchema, type Event } from '../schema/event.js';
import type { NextFunction, Request, Response } from 'express';
import { Router } from 'express';
import { storeEvent } from '../store/event.js';

export const eventRouter = Router()

initializeApp({
    // credential: applicationDefault()
    projectId: process.env.GCLOUD_PROJECT || 'demo-famobi-analytics'
})

export const db = getFirestore();

eventRouter.post('/', validateBodyForEvents(eventSchema), async (req: Request, res: Response, next: NextFunction) => {

    // data is already validated at this point, so safe to treat as event data
    const eventData = req.body as Event;

    try {
        console.debug(eventData);
        // Send data to firebase / firestore
        await storeEvent(eventData);
        res.status(201).json({ status: 'data saved' });
    } catch (err) {
        next(err);
    }
})