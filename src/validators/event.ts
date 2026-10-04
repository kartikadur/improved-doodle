import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

/**
 * Reusable middleware: validates req.body against any Zod schema.
 * On success, req.body is replaced with the parsed (typed, stripped) data.
 * On failure, responds 400 with a list of issues.
 */
export const validateBodyForEvents =
    <T extends z.ZodType>(schema: T) =>
        (req: Request, res: Response, next: NextFunction) => {
            const result = schema.safeParse(req.body);
            console.debug(result);

            if (!result.success) {
                return res.status(400).json({
                    error: "Invalid request body",
                    issues: result.error.issues.map((issue) => ({
                        path: issue.path.join("."),
                        message: issue.message,
                    })),
                });
            }

            req.body = result.data;
            next();
        };
