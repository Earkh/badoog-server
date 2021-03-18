import { FileUpload } from "../interfaces/file-upload";

import path from 'path'
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSystem {
    constructor() { };

    saveTempImage(file: FileUpload, userId: string) {

        const path = this.createUserFolder(userId);

        const fileName = this.generateUniqueName(file.name);
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

    private generateUniqueName(originalName: string) {
        const nameArray = originalName.split('.');
        const extension = nameArray[nameArray.length - 1];

        const uniqueName = uniqid();

        return `${uniqueName}.${extension}`
    }
}