import { Schema, model } from 'mongoose';

const communitySchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    img: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default model('Community', communitySchema);