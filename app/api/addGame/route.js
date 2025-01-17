import connectDB from '@/config/mongodb';
import User from '@/app/models/user';
import UserGameSchema from '@/app/models/game';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import { getDlcDetails } from '@/utils/getDlcDetails'


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
            personal_notes, lists, summary, category, themes,
            game_modes, player_perspectives, franchises, developer,
            publisher, dlc, expansions, release_date, finished
        } = data;

        const dlcDetails = await getDlcDetails(dlc);
        const expansionsDetails = await getDlcDetails(expansions);
        const platformsWithMedium = platforms.map((platform) => {
            return {
                id: platform.id,
                name: platform.name,
                medium: platform.medium,
            };
        });

        const newUserGame = await UserGameSchema.create({
            user_id: session.user.id,
            igdb_id,
            title,
            platforms: platformsWithMedium,
            genres,
            cover_image,
            rating,
            personal_notes,
            lists,
            summary,
            category,
            themes,
            game_modes,
            player_perspectives,
            franchises,
            developer,
            publisher,
            dlc: dlcDetails,
            expansions: expansionsDetails,
            release_date,
            finished
        }).catch(error => {
            console.error('Error creating UserGame:', error);
            throw error;
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