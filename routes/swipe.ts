import { Router, Response } from 'express';
import { Swipe } from '../models/swipe.model';

const swipeRoutes = Router();

swipeRoutes.post('/:userId/:targetId', (req: any, res: Response) => {

    const body = req.body;

    body.swiperId = req.params.userId;
    body.targetId = req.params.targetId;

    Swipe.create(body).then(swipeDB => {
        res.json({
            ok: true,
            swipe: swipeDB,
        });
    }).catch(err => {
        res.json(err)
    })

})

swipeRoutes.get('/:userId/:targetId', (req: any, res: Response) => {

    const body = req.body;

    body.swiperId = req.params.userId;
    body.targetId = req.params.targetId;

    Swipe.findOne({ swiperId: body.swiperId, targetId: body.targetId }).then(swipeDB => {
        res.json({
            ok: true,
            swipe: swipeDB,
        });
    }).catch(err => {
        res.json(err)
    })

})

export default swipeRoutes;