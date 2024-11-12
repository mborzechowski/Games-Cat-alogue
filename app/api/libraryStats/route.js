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
        const completedGamesCount = userGames.filter(game => game.finished === true).length;
        const genresSet = new Set();
        const developersSet = new Set();
        const platformsSet = new Set();
        const ratings = userGames.map(game => game.rating).filter(rating => rating != null);

        // Zmienne do liczenia wystąpień
        const genresCount = {};
        const developerCount = {};
        const platformsCount = {};
        const ratingsCount = Array(10).fill(0);  // Tablica dla ocen od 1 do 10

        const physicalCount = userGames.reduce((count, game) => {
            return count + game.platforms.filter(platform => platform.medium === 'physical').length;
        }, 0);

        const digitalCount = userGames.reduce((count, game) => {
            return count + game.platforms.filter(platform => platform.medium === 'digital').length;
        }, 0);

        userGames.forEach(game => {
            // Zbieranie unikalnych gatunków i ich liczba
            game.genres.forEach(genre => {
                if (genre.name) {
                    genresSet.add(genre.name);
                    genresCount[genre.name] = (genresCount[genre.name] || 0) + 1;
                }
            });

            // Zbieranie unikalnych deweloperów i ich liczba
            game.developer.forEach(developer => {
                if (developer) {
                    developersSet.add(developer);
                    developerCount[developer] = (developerCount[developer] || 0) + 1;
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
            completedGamesCount,
            genres: Array.from(genresSet),
            totalGenres: genresSet.size,
            genresCount,
            developers: Array.from(developersSet),
            totalDevelopers: developersSet.size,
            developerCount,
            platforms: Array.from(platformsSet),
            totalPlatforms: platformsSet.size,
            platformsCount,
            physicalGames: physicalCount,
            digitalGames: digitalCount,
            averageRating: ratings.length > 0 ? (ratings.reduce((acc, curr) => acc + curr, 0) / ratings.length).toFixed(1) : null,
            ratings: ratingsCount,
            newestGame: userGames
                .filter(game => !game.lists.includes('wishlist'))
                .reduce((latest, game) => {
                    return latest.date_added > game.date_added ? latest : game;
                }).title,
            oldestGame: userGames
                .filter(game => new Date(game.release_date) <= new Date() && !game.lists.includes('wishlist'))
                .reduce((oldest, game) => {
                    return oldest.release_date < game.release_date ? oldest : game;
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