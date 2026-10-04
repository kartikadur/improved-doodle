import { z } from "zod";

const reasonSchema = z.enum(["fail", "complete", "quit"]);

export const levelEventDataSchema = z.object({
  durationMs: z.number(),
  level: z.number(),
  occurredAt: z.number(),
  progress: z.number(),
  reason: reasonSchema,
  score: z.number(),
});

export const gameEventDataSchema = z.object({
  reason: reasonSchema,
  score: z.number(),
  bestScore: z.number(),
  level: z.number(),
  bestLevel: z.number(),
  occurredAt: z.number(),
});

// Discriminated union on `eventId`: the value of eventId decides the shape of `data`.
export const eventSchema = z.discriminatedUnion("eventId", [
  z.object({
    eventId: z.literal("level"),
    userId: z.uuid(),
    data: levelEventDataSchema,
  }),
  z.object({
    eventId: z.literal("game"),
    userId: z.uuid(),
    data: gameEventDataSchema,
  }),
]);

export type LevelEventData = z.infer<typeof levelEventDataSchema>;
export type GameEventData = z.infer<typeof gameEventDataSchema>;
export type Event = z.infer<typeof eventSchema>;