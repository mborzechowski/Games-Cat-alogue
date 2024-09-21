import connectDB from '@/config/mongodb';
import UserGame from '@/app/models/game';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';

export async function DELETE(req) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            return new Response(JSON.stringify({ message: 'User not authenticated.' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }


        const url = new URL(req.url, `http://${req.headers.host}`);
        const gameId = url.searchParams.get('gameId');

        if (!gameId) {
            return new Response(JSON.stringify({ message: 'Game ID is required.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }


        const deletedGame = await UserGame.findOneAndDelete({
            _id: gameId,
            user_id: session.user.id,
        });

        if (!deletedGame) {
            return new Response(JSON.stringify({ message: 'Game not found or already deleted.' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ message: 'Game deleted successfully.' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error deleting game:', error);
        return new Response(JSON.stringify({ message: 'Server error.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
