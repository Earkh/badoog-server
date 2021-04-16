"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const swipe_model_1 = require("../models/swipe.model");
const swipeRoutes = express_1.Router();
swipeRoutes.post('/:userId/:targetId', (req, res) => {
    const body = req.body;
    body.swiperId = req.params.userId;
    body.targetId = req.params.targetId;
    swipe_model_1.Swipe.create(body).then(swipeDB => {
        res.json({
            ok: true,
            swipe: swipeDB,
        });
    }).catch(err => {
        res.json(err);
    });
});
swipeRoutes.get('/:userId/:targetId', (req, res) => {
    const body = req.body;
    body.swiperId = req.params.userId;
    body.targetId = req.params.targetId;
    swipe_model_1.Swipe.findOne({ swiperId: body.swiperId, targetId: body.targetId }).then(swipeDB => {
        res.json({
            ok: true,
            swipe: swipeDB,
        });
    }).catch(err => {
        res.json(err);
    });
});
exports.default = swipeRoutes;
