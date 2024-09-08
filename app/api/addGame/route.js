import connectDB from '@/config/mongodb';
import User from '@/app/models/user';
import UserGameSchema from '@/app/models/game';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';

export async function POST(req) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            return new Response(JSON.stringify({ message: 'Please login to add a game to your library.' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const data = await req.json();



        const {
            igdb_id, title, platforms, genres, cover_image, rating,
            personal_notes, status, summary, category, themes,
            game_modes, player_perspectives, franchises, developer,
            publisher, dlc, expansions
        } = data;

        const newUserGame = await UserGameSchema.create({
            user_id: session.user.id,
            igdb_id,
            title,
            platforms,
            genres,
            cover_image,
            rating,
            personal_notes,
            status,
            summary,
            category,
            themes,
            game_modes,
            player_perspectives,
            franchises,
            developer,
            publisher,
            dlc,
            expansions,

        });

        await User.findByIdAndUpdate(
            session.user.id,
            { $push: { library: newUserGame._id } },
            { new: true }
        );

        return new Response(JSON.stringify({ message: 'Game added to library successfully.' }), { status: 200 });

    } catch (error) {
        console.error('Error adding game to library:', error);
        return new Response(JSON.stringify({ message: 'Failed to add game to library.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}