import connectDB from '@/config/mongodb';
import UserGameSchema from '@/app/models/game';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';

export async function GET(req) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            return new Response(JSON.stringify({ isOnWishlist: false, isInDatabase: false }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const host = req.headers.host || 'defaultHost';
        const url = new URL(req.url, `http://${host}`);
        const igdb_id = url.searchParams.get('igdb_id');

        if (!igdb_id) {
            return new Response(JSON.stringify({ isOnWishlist: false, isInDatabase: false }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const userGames = await UserGameSchema.find({ user_id: session.user.id, igdb_id });

        if (userGames.length === 0) {
            return new Response(JSON.stringify({ isOnWishlist: false, isInDatabase: false }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const gameInWishlist = userGames.some((game) => game.lists.includes('wishlist'));

        return new Response(
            JSON.stringify({
                isOnWishlist: gameInWishlist,
                isInDatabase: true,
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        console.error('Error checking game wishlist:', error);
        return new Response(JSON.stringify({ isOnWishlist: false, isInDatabase: false }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}