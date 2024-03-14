"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const activityLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
};
exports.default = activityLogger;
