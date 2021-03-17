import { Response, Request, NextFunction } from 'express';
import Token from '../classes/token';

export const checkToken = (req: any, res: Response, next: NextFunction) => {

    const userToken = req.get('x-token') || '';

    Token.tokenCompare(userToken).then((decoded: any) => {
        req.user = decoded.user;
        next();
    }).catch(err => {

        res.json({
            ok: false,
            mensaje: 'Token no es correcto'
        });
    })
}