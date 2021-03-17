"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("../classes/token"));
exports.checkToken = (req, res, next) => {
    const userToken = req.get('x-token') || '';
    token_1.default.tokenCompare(userToken).then((decoded) => {
        req.user = decoded.user;
        next();
    }).catch(err => {
        res.json({
            ok: false,
            mensaje: 'Token no es correcto'
        });
    });
};
