import { FieldValue } from "firebase-admin/firestore";
import { db } from "../routes/event.js";
import type { Event } from "../schema/event.js";

export async function storeEvent(event: Event): Promise<void> {

    const eventRef = db.collection('events').doc();
    const rawEvent = { ...event, createAt: FieldValue.serverTimestamp() };

    // handle game data
    if (event.eventId === 'game') {
        const batch = db.batch();
        batch.set(eventRef, rawEvent);
        batch.set(
            db.doc('gameStats/summary'),
            {
                total: FieldValue.increment(1),
                reason: {
                    [event.data.reason]: FieldValue.increment(1),
                },
                updatedAt: FieldValue.serverTimestamp(),
            },
            { merge: true },
        );
        await batch.commit();
        return;
    }

    if (event.eventId === 'level') {
        const { reason, level, durationMs } = event.data

        // For now data for non completion is not interesting, so store it raw for the future
        if (reason !== 'complete') {
            eventRef.set(rawEvent);
            return;
        }

        const statsRef = db.doc(`levelStats/${level}`);
        const completersRef = statsRef.collection('completers').doc(event.userId);

        await db.runTransaction(async tx => {
            const [statsSnapshot, completersSnapshot] = await tx.getAll(statsRef, completersRef);
            const stats = statsSnapshot?.data();
            const isCompleterNew = !completersSnapshot?.exists;

            tx.set(eventRef, rawEvent);

            tx.set(
                statsRef,
                {
                    completions: FieldValue.increment(1),
                    uniqueCompletions: FieldValue.increment(isCompleterNew ? 1 : 0),
                    minDurationMs: Math.min(stats?.minDurationMs ?? durationMs, durationMs),
                    maxDurationMs: Math.max(stats?.maxDurationMs ?? durationMs, durationMs),
                    updatedAt: FieldValue.serverTimestamp(),
                },
                { merge: true },
            );

            if (isCompleterNew) {
                tx.set(completersRef, { firstCompletedAt: FieldValue.serverTimestamp() });
            }
        });
    }
}