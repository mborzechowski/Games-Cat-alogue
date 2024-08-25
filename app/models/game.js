import mongoose from 'mongoose';

const UserGameSchema = new mongoose.Schema({
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
    platforms: [String], // Dane skopiowane z IGDB
    genres: [String],    // Dane skopiowane z IGDB
    cover_image: String, // Dane skopiowane z IGDB
    rating: {
        type: Number,
        min: 0,
        max: 10, // Zakładając, że skala ocen to 0-10
    },
    personal_notes: String,
    status: {
        type: String,
        enum: ['wishlist', 'loaned', 'for sale'],
        default: 'wishlist',
    },
    date_added: {
        type: Date,
        default: Date.now,
    },
    date_last_modified: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: { createdAt: 'date_added', updatedAt: 'date_last_modified' } });

export default mongoose.models.UserGame || mongoose.model('UserGame', UserGameSchema);

