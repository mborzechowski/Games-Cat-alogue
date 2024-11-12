import connectDB from '@/config/mongodb';
import User from '@/app/models/user';
import Game from '@/app/models/game';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';


export async function GET(req) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            return new Response(JSON.stringify({ message: 'User not authenticated.' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }


        const user = await User.findById(session.user.id).exec();

        if (!user) {
            return new Response(JSON.stringify({ message: 'User not found.' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const url = new URL(req.url, `http://${req.headers.host}`);
        const listType = url.searchParams.get('list');
        const onlyWithImages = url.searchParams.get('onlyWithImages') === 'true';

        const platform = url.searchParams.get('platform');
        const developer = url.searchParams.get('developer');
        const publisher = url.searchParams.get('publisher');
        const genres = url.searchParams.get('genres');
        const themes = url.searchParams.get('themes');

        const gameModes = url.searchParams.get('gameModes');
        const playerPerspectives = url.searchParams.get('playerPerspectives');
        const franchise = url.searchParams.get('franchises');
        const medium = url.searchParams.get('medium');

        const gamesQuery = {
            _id: { $in: user.library }
        };

        if (onlyWithImages) {
            gamesQuery['additional_img'] = { $ne: [] };
        }


        const listMapping = {
            'Wishlist': 'wishlist',
            'Next in line': 'next',
            'On loan': 'loan',
            'On hold': 'hold',
            'On sale': 'sale'
        };

        if (listType) {
            const mappedList = listMapping[listType];
            if (mappedList) {
                gamesQuery['lists'] = mappedList;
            } else {
                return new Response(JSON.stringify({ message: 'Invalid list type.' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        } else {

            gamesQuery['lists'] = { $ne: 'wishlist' };
        }

        if (platform) gamesQuery['platforms'] = { $elemMatch: { name: platform } };
        if (genres) gamesQuery['genres'] = { $elemMatch: { name: genres } };
        if (themes) gamesQuery['themes'] = themes;
        if (franchise) gamesQuery['franchises'] = franchise;
        if (developer) gamesQuery['developer'] = developer;
        if (publisher) gamesQuery['publisher'] = publisher;
        if (medium) gamesQuery['platforms'] = { $elemMatch: { medium: medium } };
        if (gameModes) gamesQuery['game_modes'] = gameModes;
        if (playerPerspectives) gamesQuery['player_perspectives'] = playerPerspectives;


        const library = await Game.find(gamesQuery).exec();


        return new Response(JSON.stringify(library), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching user library:', error);
        return new Response(JSON.stringify({ message: 'Failed to fetch library.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}