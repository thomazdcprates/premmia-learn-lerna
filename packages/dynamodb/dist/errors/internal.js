"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalError = void 0;
class InternalError extends Error {
    constructor(message) {
        super(message);
        this.name = "InternalError";
    }
}
exports.InternalError = InternalError;
