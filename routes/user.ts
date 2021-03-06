import { Router, Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import Token from '../classes/token';
import { checkToken } from '../middlewares/auth'
import FileSystem from '../classes/fileSystem';

const userRoutes = Router();
const fileSystem = new FileSystem();

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

// Get user
userRoutes.get('/info', checkToken, (req: any, res: Response) => {
    const user = req.user;

    res.json({
        ok: true,
        user
    });
})

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
    });
});

// GET Filtered Users
userRoutes.get('/:sex/:size/:minAge/:maxAge', async (req: any, res: Response) => {

    const filters = {
        sex: req.params.sex,
        size: req.params.size,
        minAge: req.params.minAge,
        maxAge: req.params.maxAge
    };

    if (filters.sex == "indiferente") {
        const users = await User.find({ sex: { $ne: undefined }, size: filters.size, age: { $gt: filters.minAge, $lt: filters.maxAge } }).sort({ _id: -1 }).exec()
        res.json({
            ok: true,
            users
        })
    } else {
        const users = await User.find({ sex: filters.sex, size: filters.size, age: { $gt: filters.minAge, $lt: filters.maxAge } }).sort({ _id: -1 }).exec()  //.sort() ordenar .limit() limitar resultados
        res.json({
            ok: true,
            users
        })
    }
})

// Upload Images
userRoutes.post('/upload', checkToken, async (req: any, res: Response) => {

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

    await fileSystem.saveTempImage(file, req.user._id).then(console.log).catch(console.error);

    const user = {
        img: req.user._id + ".jpg",
    };

    User.findByIdAndUpdate(req.user._id, user, { new: true }, (err, userDB) => {
        if (err) throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe el usuario'
            })
        }
    })

    res.json({
        ok: true,
        file: file,
        res: req.user._id
    })
})

// GET User image
userRoutes.get('/imagen/:userid/:img', (req: any, res: Response) => {
    const userId = req.params.userid;
    const img = req.params.img;

    const path = fileSystem.getImgUrl(userId, img);

    res.sendFile(path);
})

export default userRoutes;