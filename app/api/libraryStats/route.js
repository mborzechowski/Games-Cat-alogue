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

        const userGames = await Game.find({
            user_id: session.user.id,
            lists: { $ne: 'whislist' }
        }).exec();


        if (!userGames || userGames.length === 0) {
            return new Response(JSON.stringify({ message: 'No games found.' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Statystyki
        const totalGames = userGames.length;
        const genresSet = new Set();
        const publishersSet = new Set();
        const platformsSet = new Set();
        const ratings = userGames.map(game => game.rating).filter(rating => rating != null);
        const listsCount = {};

        userGames.forEach(game => {
            // Zbieranie unikalnych gatunków
            game.genres.forEach(genre => {
                if (genre.name) {
                    genresSet.add(genre.name);
                }
            });

            // Zbieranie unikalnych wydawców
            game.publisher.forEach(publisher => {
                if (publisher) {
                    publishersSet.add(publisher);
                }
            });

            // Zbieranie unikalnych platform
            game.platforms.forEach(platform => {
                platformsSet.add(platform.name);
            });

            // Zliczanie gier w poszczególnych listach
            game.lists.forEach(list => {
                listsCount[list] = (listsCount[list] || 0) + 1;
            });
        });

        // Statystyki do zwrócenia
        const stats = {
            totalGames,
            genres: Array.from(genresSet),
            totalGenres: genresSet.size,
            publishers: Array.from(publishersSet),
            totalPublishers: publishersSet.size,
            platforms: Array.from(platformsSet),
            totalPlatforms: platformsSet.size,
            averageRating: ratings.length > 0 ? (ratings.reduce((acc, curr) => acc + curr, 0) / ratings.length).toFixed(1) : null,
            gamesInLists: listsCount,
            newestGame: userGames.reduce((latest, game) => {
                return latest.date_added > game.date_added ? latest : game;
            }).title,
        };

        return new Response(JSON.stringify(stats), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching library stats:', error);
        return new Response(JSON.stringify({ message: 'Failed to fetch library stats.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
