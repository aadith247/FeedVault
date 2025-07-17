"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentModel = exports.linkModel = exports.userModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
(0, mongoose_1.connect)('mongodb+srv://Aadithhya:Venkat%40123@cluster0.7lvh3qz.mongodb.net/Brain');
const userSchema = new mongoose_1.Schema({
    username: String,
    password: String
});
exports.userModel = (0, mongoose_1.model)("Users", userSchema);
const contentSchema = new mongoose_1.Schema({
    title: String,
    type: String,
    link: String,
    tags: [{ type: mongoose_1.default.Types.ObjectId, ref: "Tags" }],
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'Users', required: true }
});
const linkSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.default.Types.ObjectId, ref: "Users" },
    link: String
});
exports.linkModel = (0, mongoose_1.model)("Links", linkSchema);
exports.contentModel = (0, mongoose_1.model)("Contents", contentSchema);
