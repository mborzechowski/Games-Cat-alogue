import connectDB from '@/config/mongodb';
import UserGameSchema from '@/app/models/game';

export async function GET(req) {
    try {
        await connectDB();

        const platforms = await UserGameSchema.distinct('platforms.name');
        const genres = await UserGameSchema.distinct('genres');
        const franchises = await UserGameSchema.distinct('franchises');
        const themes = await UserGameSchema.distinct('themes');
        const developers = await UserGameSchema.distinct('developer');
        const publishers = await UserGameSchema.distinct('publisher');

        return new Response(JSON.stringify({
            platforms,
            genres,
            franchises,
            themes,
            developers,
            publishers,
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Error fetching filter options:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch filter options' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
