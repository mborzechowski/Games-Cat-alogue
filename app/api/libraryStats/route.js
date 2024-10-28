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

        // Zmienne do liczenia wystąpień
        const genresCount = {};
        const publishersCount = {};
        const platformsCount = {};
        const ratingsCount = Array(10).fill(0);  // Tablica dla ocen od 1 do 10

        userGames.forEach(game => {
            // Zbieranie unikalnych gatunków i ich liczba
            game.genres.forEach(genre => {
                if (genre.name) {
                    genresSet.add(genre.name);
                    genresCount[genre.name] = (genresCount[genre.name] || 0) + 1;
                }
            });

            // Zbieranie unikalnych wydawców i ich liczba
            game.publisher.forEach(publisher => {
                if (publisher) {
                    publishersSet.add(publisher);
                    publishersCount[publisher] = (publishersCount[publisher] || 0) + 1;
                }
            });

            // Zbieranie unikalnych platform i ich liczba
            game.platforms.forEach(platform => {
                if (platform.name) {
                    platformsSet.add(platform.name);
                    platformsCount[platform.name] = (platformsCount[platform.name] || 0) + 1;
                }
            });

            // Liczenie ocen
            const rating = game.rating;
            if (rating >= 1 && rating <= 10) {
                ratingsCount[rating - 1] += 1; // Dopasowanie do indeksu tablicy (0–9)
            }
        });

        // Statystyki do zwrócenia
        const stats = {
            totalGames,
            genres: Array.from(genresSet),
            totalGenres: genresSet.size,
            genresCount,
            publishers: Array.from(publishersSet),
            totalPublishers: publishersSet.size,
            publishersCount,
            platforms: Array.from(platformsSet),
            totalPlatforms: platformsSet.size,
            platformsCount,
            averageRating: ratings.length > 0 ? (ratings.reduce((acc, curr) => acc + curr, 0) / ratings.length).toFixed(1) : null,
            ratings: ratingsCount,
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
