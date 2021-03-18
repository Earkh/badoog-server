"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const user_1 = __importDefault(require("./routes/user"));
const swipe_1 = __importDefault(require("./routes/swipe"));
const server = new server_1.default();
// BODY PARSER
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// FILE UPLOAD
server.app.use(express_fileupload_1.default());
// ROUTES
server.app.use('/user', user_1.default);
server.app.use('/swipe', swipe_1.default);
// DB
mongoose_1.default.connect('mongodb://localhost:27017/badoog', { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if (err)
        throw err;
    console.log('DB connected');
});
// START
server.start(() => {
    console.log(`Server running on port ${server.port}.`);
});