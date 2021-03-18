import { Schema, Document, model } from 'mongoose';

const swipeSchema = new Schema({

    created: {
        type: Date
    },
    swiperId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true]
    },
    targetId: {
        type: String
    }
});

swipeSchema.pre<ISwipe>('save', function (next) {
    this.created = new Date();
    next();
})

interface ISwipe extends Document {
    created: Date;
    swiperId: string;
    targetId: string;
}

export const Swipe = model<ISwipe>('Swipe', swipeSchema);