"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // export default
//normal export means you have to destructure
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
const db_2 = require("./db");
const cors_1 = __importDefault(require("cors"));
const db_3 = require("./db");
const middleware_1 = require("./middleware");
const app = (0, express_1.default)();
const secrets_js_grempe_1 = require("secrets.js-grempe");
const config_1 = require("./config");
app.use((0, cors_1.default)());
app.use(express_1.default.json()); // export the entire thing, we need to import the specific by destructuring
app.get("/", (req, res) => {
    console.log("hdded");
    res.json({});
});
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const userExists = yield db_1.userModel.findOne({ username });
    if (userExists) {
        res.status(411).send({
            message: "The username already exists/you are registered already"
        });
    }
    else {
        yield db_1.userModel.create({
            username: username,
            password: password
        });
        res.json({
            message: "success"
        });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const response = yield db_1.userModel.findOne({ username });
    if (!response) {
        res.status(403).json({
            message: "Incorrect credentials"
        });
    }
    else {
        const token = jsonwebtoken_1.default.sign({
            id: response._id
        }, config_1.jwt_pass);
        res.json({ token });
    }
}));
app.delete("/api/v1/delete/:title/:link", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentTitle = req.params.title;
    const contentLink = req.params.link;
    const response = yield db_2.contentModel.deleteMany({
        title: contentTitle,
        link: contentLink,
        //@ts-ignore
        userId: req.userId
    });
    console.log(response);
    if (response) {
        res.json({
            message: "success"
        });
    }
    else {
        res.json({
            message: response
        });
    }
}));
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.body.title;
    const link = req.body.link;
    const type = req.body.type;
    yield db_2.contentModel.create({
        title: title,
        link: link,
        type: type,
        //@ts-ignore
        userId: req.userId,
        tags: []
    });
    res.json({
        message: "content added"
    });
}));
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const link = req.userId;
    const content = yield db_2.contentModel.find({ userId: link }).populate("userId", "username");
    res.json({
        content
    });
}));
app.post("/api/v1/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let share = req.body.share;
    //@ts-ignore
    const hash = (0, secrets_js_grempe_1.random)(15);
    if (share) {
        yield db_3.linkModel.create({
            //@ts-ignore
            userId: req.userId,
            link: hash,
        });
        res.json({
            message: "link is " + hash
        });
    }
    else {
        yield db_3.linkModel.deleteOne({
            //@ts-ignore
            userId: req.userId
        });
        res.json({
            message: "Link has been deleted"
        });
    }
    res.json({});
}));
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const shareLink = req.params.shareLink;
    const content = yield db_3.linkModel.findOne({ link: shareLink });
    if (content) {
        let userId = content.userId;
        let data = yield db_2.contentModel.find({ userId: userId });
        if (data) {
            res.json({ data });
        }
        else {
            res.json({
                message: "nothing to see"
            });
        }
    }
    else {
        res.json({
            message: "link is invalid"
        });
    }
}));
app.listen(3001);
