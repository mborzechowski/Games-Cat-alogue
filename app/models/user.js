import mongoose from 'mongoose';

import UserGameSchema from './game';

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: [true, 'Email already exists'],
            required: [true, 'Email is required'],
        },
        username: {
            type: String,
            required: [true, 'Username is required'],
        },
        image: {
            type: String,
        },
        library: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'UserGame',
            },
        ],
    },
    {
        timestamps: true,
    }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;