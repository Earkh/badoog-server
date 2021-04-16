"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        // required: [true, 'El campo nombre es obligatorio']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El campo email es obligatorio']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String
    },
    age: {
        type: Number,
        // required: [true, 'El campo edad es obligatorio']
    },
    size: {
        type: String,
        // required: [true, 'El campo tamaño es obligatorio']
    },
    sex: {
        type: String,
        // required: [true, 'El campo sexo es obligatorio']
    },
    desc: {
        type: String
    },
});
userSchema.method('pwdCompare', function (password = '') {
    if (bcrypt_1.default.compareSync(password, this.password)) {
        return true;
    }
    else {
        return false;
    }
});
exports.User = mongoose_1.model('User', userSchema);
