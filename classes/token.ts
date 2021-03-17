import jwt from 'jsonwebtoken'


export default class Token {

    private static seed: string = 'badoog-es-goodab-al-reves';
    private static expiration: string = '30d';

    constructor() { }

    static getJwtToken(payload: any): string {

        return jwt.sign({
            user: payload
        }, this.seed, { expiresIn: this.expiration });
    }

    static tokenCompare(userToken: string) {

        return new Promise((resolve, reject) => {
            jwt.verify(userToken, this.seed, (err, decoded) => {
                if (err) {
                    reject();
                } else {
                    resolve(decoded);
                }
            })
        })
    }

}