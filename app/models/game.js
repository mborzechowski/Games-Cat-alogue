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
            medium: { type: String, enum: ['physical', 'digital', 'unknown'], required: true },
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
        dlc: [{
            id: { type: Number },
            name: { type: String },
            cover_image: { type: String },
        }],
        expansions: [{
            id: { type: Number },
            name: { type: String },
            cover_image: { type: String },
        }],
        additional_img: [{
            url: { type: String },
            uploaded_at: { type: Date, default: Date.now }
        }],
        date_added: {
            type: Date,
            default: Date.now,
        },
        date_last_modified: {
            type: Date,
            default: Date.now,
        },
        release_date: {
            type: Date,
            required: false,
        },
        finished: { type: Boolean, default: false }
    },
    {
        timestamps: { createdAt: 'date_added', updatedAt: 'date_last_modified' },
    }
);

export default mongoose.models.UserGame || mongoose.model('UserGame', UserGameSchema);
