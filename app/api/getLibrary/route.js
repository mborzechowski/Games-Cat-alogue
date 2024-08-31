import connectDB from '@/config/mongodb';
import User from '@/app/models/user';
import UserGame from '@/app/models/game';
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

        // Find user and populate their library with game details
        const user = await User.findById(session.user.id).populate('library');

        if (!user) {
            return new Response(JSON.stringify({ message: 'User not found.' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify(user.library), {
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