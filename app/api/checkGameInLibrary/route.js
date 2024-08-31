import connectDB from '@/config/mongodb';
import UserGameSchema from '@/app/models/game';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';

export async function GET(req) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            return new Response(JSON.stringify({ platforms: [] }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { searchParams } = new URL(req.url);
        const igdb_id = searchParams.get('igdb_id');

        if (!igdb_id) {
            return new Response(JSON.stringify({ platforms: [] }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const userGames = await UserGameSchema.find({ user_id: session.user.id, igdb_id });


        const platforms = userGames.flatMap((game) => game.platforms.map((p) => p.id));

        return new Response(JSON.stringify({ platforms }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error checking game in library:', error);
        return new Response(JSON.stringify({ platforms: [] }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
