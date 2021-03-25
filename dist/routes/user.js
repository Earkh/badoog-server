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
const express_1 = require("express");
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const auth_1 = require("../middlewares/auth");
const fileSystem_1 = __importDefault(require("../classes/fileSystem"));
const userRoutes = express_1.Router();
const fileSystem = new fileSystem_1.default();
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
// Get user
userRoutes.get('/info', auth_1.checkToken, (req, res) => {
    const user = req.user;
    res.json({
        ok: true,
        user
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
// GET Users
userRoutes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find().sort({ _id: -1 }).exec(); //.sort() ordenar .limit() limitar resultados
    res.json({
        ok: true,
        users
    });
}));
// Upload Images
userRoutes.post('/upload', auth_1.checkToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No se subió ningún archivo',
        });
    }
    const file = req.files.img;
    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            mensaje: 'El archivo no es una imagen'
        });
    }
    yield fileSystem.saveTempImage(file, req.user._id).then(console.log).catch(console.error);
    const user = {
        img: req.user._id + ".jpg",
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
    });
    res.json({
        ok: true,
        file: file,
        res: req.user._id
    });
}));
userRoutes.get('/imagen/:userid/:img', (req, res) => {
    const userId = req.params.userid;
    const img = req.params.img;
    const path = fileSystem.getImgUrl(userId, img);
    res.sendFile(path);
});
exports.default = userRoutes;
