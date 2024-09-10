import connectDB from '@/config/mongodb';
import User from '@/app/models/user';
import Game from '@/app/models/game';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import game from '@/app/models/game';

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

        const url = new URL(req.url);
        const whislistParam = url.searchParams.get('whislist');
        const whislist = whislistParam === 'true';

        const gamesQuery = {
            _id: { $in: user.library }
        };

        if (!whislist) {
            gamesQuery['lists'] = { $ne: 'whislist' }
        } else {
            gamesQuery['lists'] = 'whislist'
        }

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