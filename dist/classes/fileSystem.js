"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class FileSystem {
    constructor() { }
    ;
    saveTempImage(file, userId) {
        return new Promise((resolve, reject) => {
            const path = this.createUserFolder(userId);
            const fileName = userId + ".jpg";
            file.mv(`${path}/${fileName}`, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    createUserFolder(userId) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads', userId);
        const pathUserTemp = path_1.default.resolve(pathUser + '/temp');
        const exists = fs_1.default.existsSync(pathUser);
        if (!exists) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    getImgUrl(userId, img) {
        const pathImg = path_1.default.resolve(__dirname, '../uploads', userId, 'temp', img);
        return pathImg;
    }
}
exports.default = FileSystem;
