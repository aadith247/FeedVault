"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const userMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }
    // Support both 'Bearer <token>' and just '<token>'
    const token = authHeader.replace(/^Bearer\s+/i, '');
    console.log('Authorization header:', authHeader);
    console.log('Token being verified:', token);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.jwt_pass);
        // @ts-ignore
        req.userId = decoded.id;
        next();
    }
    catch (e) {
        res.status(401).json({ message: 'Invalid token' });
        return;
    }
};
exports.userMiddleware = userMiddleware;
