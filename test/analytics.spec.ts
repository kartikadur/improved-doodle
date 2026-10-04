import { describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";

const userId = "3f2b8c1e-9d4a-4b7e-8a52-6c1f0e2d7b9a";

const levelData = {
  durationMs: 1200,
  level: 3,
  occurredAt: 1700000000000,
  progress: 0.5,
  reason: "complete",
  score: 100,
};

const gameData = {
  reason: "quit",
  score: 500,
  bestScore: 900,
  level: 4,
  bestLevel: 7,
  occurredAt: 1700000000000,
};

describe("POST /event", () => {
  describe("valid requests", () => {
    it("accepts a level event", async () => {
      const res = await request(app)
        .post("/event")
        .send({ eventId: "level", userId, data: levelData });

      expect(res.status).toBe(201);
    });

    it("accepts a game event", async () => {
      const res = await request(app)
        .post("/event")
        .send({ eventId: "game", userId, data: gameData });

      expect(res.status).toBe(201);
    });
  });

  describe("validation failures return 400", () => {
    it("rejects a userId that is not a uuid", async () => {
      const res = await request(app)
        .post("/event")
        .send({ eventId: "level", userId: "not-a-uuid", data: levelData });

      expect(res.status).toBe(400);
      expect(res.body.issues[0].path).toBe("userId");
    });

    it("rejects an unknown eventId", async () => {
      const res = await request(app)
        .post("/event")
        .send({ eventId: "banana", userId, data: levelData });

      expect(res.status).toBe(400);
    });

    it("rejects level data sent with eventId 'game'", async () => {
      const res = await request(app)
        .post("/event")
        .send({ eventId: "game", userId, data: levelData });

      expect(res.status).toBe(400);
    });

    it("rejects game data sent with eventId 'level'", async () => {
      const res = await request(app)
        .post("/event")
        .send({ eventId: "level", userId, data: gameData });

      expect(res.status).toBe(400);
    });

    it("rejects a field with the wrong type", async () => {
      const res = await request(app)
        .post("/event")
        .send({
          eventId: "level",
          userId,
          data: { ...levelData, score: "100" },
        });

      expect(res.status).toBe(400);
      expect(res.body.issues[0].path).toBe("data.score");
    });

    it("rejects an invalid reason value", async () => {
      const res = await request(app)
        .post("/event")
        .send({
          eventId: "level",
          userId,
          data: { ...levelData, reason: "rage-quit" },
        });

      expect(res.status).toBe(400);
    });
  });

  describe("missing data returns 400", () => {
    it("rejects a missing eventId", async () => {
      const res = await request(app)
        .post("/event")
        .send({ userId, data: levelData });

      expect(res.status).toBe(400);
    });

    it("rejects a missing userId", async () => {
      const res = await request(app)
        .post("/event")
        .send({ eventId: "level", data: levelData });

      expect(res.status).toBe(400);
    });

    it("rejects missing data", async () => {
      const res = await request(app)
        .post("/event")
        .send({ eventId: "level", userId });

      expect(res.status).toBe(400);
    });

    it("rejects a data object with a missing field", async () => {
      const { durationMs, ...incomplete } = levelData;

      const res = await request(app)
        .post("/event")
        .send({ eventId: "level", userId, data: incomplete });

      expect(res.status).toBe(400);
      expect(res.body.issues[0].path).toBe("data.durationMs");
    });

    it("rejects an empty JSON object", async () => {
      const res = await request(app).post("/event").send({});

      expect(res.status).toBe(400);
    });

    it("rejects a request with no body and no content-type", async () => {
      const res = await request(app).post("/event");

      expect(res.status).toBe(400);
    });
  });

  describe("malformed JSON returns 400", () => {
    it("rejects syntactically invalid JSON", async () => {
      const res = await request(app)
        .post("/event")
        .set("Content-Type", "application/json")
        .send('{"eventId": "level", "userId": ');

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: "Malformed JSON" });
    });
  });
});