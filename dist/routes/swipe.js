"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const swipe_model_1 = require("../models/swipe.model");
const swipeRoutes = express_1.Router();
swipeRoutes.post('/', auth_1.checkToken, (req, res) => {
    const body = req.body;
    body.swiperId = req.user._id;
    swipe_model_1.Swipe.create(body).then(swipeDB => {
        res.json({
            ok: true,
            swipe: swipeDB
        });
    }).catch(err => {
        res.json(err);
    });
});
exports.default = swipeRoutes;
