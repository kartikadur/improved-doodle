import { describe, expect, it } from "vitest";
import request from 'supertest';
import { app } from "../src/app.js";



describe('Server', () => {
    it('should respond with {status:ok} when running', async () => {
        const response = await request(app)
            .get('/health').expect(200);

        expect(response.body).toEqual({ status: "ok" })
    })
})