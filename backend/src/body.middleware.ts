import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export default class BodyMiddleware implements NestMiddleware {
    use(req:Request, res:Response, next:Function) {
        if (!req.body || typeof req.body !== "object") {
            res.status(401).end();
            return;
        }
        next();
    }
}