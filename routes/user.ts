import { Router, Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import Token from '../classes/token';
import { checkToken } from '../middlewares/auth'

const userRoutes = Router();

// Login
userRoutes.post('/login', (req: Request, res: Response) => {

    const body = req.body;

    User.findOne({ email: body.email }, (err: any, userDB: any) => {
        if (err) throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'Usuario o contraseña incorrecta'
            });
        }
        if (userDB.pwdCompare(body.password)) {

            const userToken = Token.getJwtToken({
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
        } else {
            res.json({
                ok: false,
                mensaje: 'Usuario/Contraseña no son correctos'
            });
        }

    });

});

// Create user
userRoutes.post('/create', (req: Request, res: Response) => {

    const user = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        age: req.body.age,
        size: req.body.size,
        sex: req.body.sex,
        desc: req.body.desc
    };

    User.create(user).then(userDB => {

        const userToken = Token.getJwtToken({
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
userRoutes.post('/update', checkToken, (req: any, res: Response) => {

    const user = {
        name: req.body.name || req.user.name,
        email: req.body.email || req.user.email,
        age: req.body.age || req.user.age,
        size: req.body.size || req.user.size,
        sex: req.body.sex || req.user.sex,
        desc: req.body.desc || req.user.desc
    };

    User.findByIdAndUpdate(req.user._id, user, { new: true }, (err, userDB) => {
        if (err) throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe el usuario'
            })
        }


        const userToken = Token.getJwtToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email
        });

        res.json({
            ok: true,
            token: userToken
        });
    })


});


export default userRoutes;