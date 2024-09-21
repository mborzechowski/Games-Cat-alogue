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

        const gamesQuery = {
            _id: { $in: user.library }
        };


        const listMapping = {
            'Wishlist': 'whislist',
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

            gamesQuery['lists'] = { $ne: 'whislist' };
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