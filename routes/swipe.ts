import { Router, Response } from 'express';
import { checkToken } from '../middlewares/auth';
import { Swipe } from '../models/swipe.model';

const swipeRoutes = Router();

swipeRoutes.post('/', checkToken, (req: any, res: Response) => {

    const body = req.body;

    body.swiperId = req.user._id;

    Swipe.create(body).then(swipeDB => {
        res.json({
            ok: true,
            swipe: swipeDB
        });
    }).catch(err => {
        res.json(err)
    })

})

export default swipeRoutes;