import mongoose from 'mongoose';

const UserGameSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        igdb_id: {
            type: Number,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        platforms: [{
            id: Number,
            name: String,
        }],
        genres: [{
            id: Number,
            name: String,
        }],
        cover_image: String,
        rating: {
            type: Number,
            min: 0,
            max: 10,
        },
        personal_notes: String,
        lists: {
            type: [String],
            default: [],
        },
        summary: String,
        category: { type: String },
        themes: [String],
        game_modes: [String],
        player_perspectives: [String],
        franchises: [String],
        developer: [String],
        publisher: [String],
        dlc: [String],
        expansions: [String],
        date_added: {
            type: Date,
            default: Date.now,
        },
        date_last_modified: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: { createdAt: 'date_added', updatedAt: 'date_last_modified' },
    }
);

export default mongoose.models.UserGame || mongoose.model('UserGame', UserGameSchema);
