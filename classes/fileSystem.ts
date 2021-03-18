import { FileUpload } from "../interfaces/file-upload";

import path from 'path'
import fs from 'fs';

export default class FileSystem {
    constructor() { };



    saveTempImage(file: FileUpload, userId: string) {

        return new Promise((resolve: any, reject) => {

            const path = this.createUserFolder(userId);

            const fileName = userId + ".jpg";

            file.mv(`${path}/${fileName}`, (err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });

        });

    }

    private createUserFolder(userId: string) {
        const pathUser = path.resolve(__dirname, '../uploads', userId);
        const pathUserTemp = path.resolve(pathUser + '/temp');

        const exists = fs.existsSync(pathUser);

        if (!exists) {
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }

        return pathUserTemp;
    }

    getImgUrl(userId: string, img: string) {

        const pathImg = path.resolve(__dirname, '../uploads', userId, 'temp', img);


        return pathImg
    }


}