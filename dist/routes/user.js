"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const auth_1 = require("../middlewares/auth");
const userRoutes = express_1.Router();
// Login
userRoutes.post('/login', (req, res) => {
    const body = req.body;
    user_model_1.User.findOne({ email: body.email }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario o contraseña incorrecta'
            });
        }
        if (userDB.pwdCompare(body.password)) {
            const userToken = token_1.default.getJwtToken({
                _id: userDB._id,
                name: userDB.name,
                email: userDB.email,
                age: userDB.age,
                size: userDB.size,
                sex: userDB.sex,
                desc: userDB.desc
            });
            res.json({
                ok: true,
                token: userToken
            });
        }
        else {
            res.json({
                ok: false,
                mensaje: 'Usuario/Contraseña no son correctos'
            });
        }
    });
});
// Create user
userRoutes.post('/create', (req, res) => {
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        age: req.body.age,
        size: req.body.size,
        sex: req.body.sex,
        desc: req.body.desc
    };
    user_model_1.User.create(user).then(userDB => {
        const userToken = token_1.default.getJwtToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            age: userDB.age,
            size: userDB.size,
            sex: userDB.sex,
            desc: userDB.desc
        });
        res.json({
            ok: true,
            token: userToken
        });
    }).catch(err => {
        res.json({
            ok: false,
            err
        });
    });
});
// Update user
userRoutes.post('/update', auth_1.checkToken, (req, res) => {
    const user = {
        name: req.body.name || req.user.name,
        email: req.body.email || req.user.email,
        age: req.body.age || req.user.age,
        size: req.body.size || req.user.size,
        sex: req.body.sex || req.user.sex,
        desc: req.body.desc || req.user.desc
    };
    user_model_1.User.findByIdAndUpdate(req.user._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe el usuario'
            });
        }
        const userToken = token_1.default.getJwtToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email
        });
        res.json({
            ok: true,
            token: userToken
        });
    });
});
exports.default = userRoutes;
