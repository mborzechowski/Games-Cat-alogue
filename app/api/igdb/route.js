import axios from 'axios';

export async function POST(request) {
    const { query } = await request.json();

    try {
        const accessToken = await getAccessToken();

        const response = await axios.post(
            'https://api.igdb.com/v4/games',
            `search "${query}"; 
        fields name, cover.url, genres.name, platforms.name, release_dates.human,
           involved_companies.company.name, involved_companies.developer,
           involved_companies.publisher, summary, category, themes.name,
           game_modes.name, player_perspectives.name, franchises.name,
           dlcs, expansions;  
    where category = (0, 4, 8, 9, 10, 11);
    limit 20;`,
            {
                headers: {
                    'Client-ID': process.env.TWITCH_CLIENT_ID,
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'text/plain',
                },
            }
        );

        return new Response(JSON.stringify(response.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching games:', error.response ? error.response.data : error.message);
        return new Response(
            JSON.stringify({ message: 'Wystąpił błąd podczas wyszukiwania.' }),
            {
                status: error.response ? error.response.status : 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}

const getAccessToken = async () => {
    try {
        const response = await axios.post(
            'https://id.twitch.tv/oauth2/token',
            new URLSearchParams({
                client_id: process.env.TWITCH_CLIENT_ID,
                client_secret: process.env.TWITCH_CLIENT_SECRET,
                grant_type: 'client_credentials',
            }).toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error.response ? error.response.data : error.message);
        throw error;
    }
};