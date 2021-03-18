"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Swipe = void 0;
const mongoose_1 = require("mongoose");
const swipeSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    swiperId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true]
    },
    targetId: {
        type: String
    }
});
swipeSchema.pre('save', function (next) {
    this.created = new Date();
    next();
});
exports.Swipe = mongoose_1.model('Swipe', swipeSchema);
