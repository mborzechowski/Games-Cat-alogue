import axios from 'axios';

export const getDlcDetails = async (gameIds) => {

    try {
        if (!gameIds || gameIds.length === 0) return [];

        const accessToken = await getAccessToken();

        const response = await axios.post(
            'https://api.igdb.com/v4/games',
            `fields name, cover.url; where id = (${gameIds.join(',')});`,
            {
                headers: {
                    'Client-ID': process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID,
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'text/plain',
                },
            }
        );

        return response.data.map((game) => ({
            id: game.id,
            name: game.name,
            cover_image: game.cover ? game.cover.url : null,
        }));
    } catch (error) {
        console.error('Error fetching DLC/Expansions details:', error);
        return [];
    }
};

const getAccessToken = async () => {
    try {
        const response = await axios.post(
            'https://id.twitch.tv/oauth2/token',
            new URLSearchParams({
                client_id: process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID,
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