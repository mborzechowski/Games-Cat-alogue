import { toast } from 'react-toastify';
import axios from 'axios';

export const useAddGameTo = () => {
    const addGameTo = async (game, session, platform, listType, checkedPlatforms, setCheckedPlatforms) => {
        if (!session) {
            toast.warn('You need to be logged in to add a game to your library.');
            return;
        }


        const platformsToAdd = listType === 'wishlist' ? game.platforms : [platform];

        if (listType === 'library' && checkedPlatforms.includes(platform.id)) {
            toast.warn('This game is already in your library on this platform.');
            return;
        }

        try {
            const response = await axios.post('/api/addGame', {
                igdb_id: game.id,
                title: game.name,
                platforms: platformsToAdd,
                genres: game.genres.map((g) => ({ id: g.id, name: g.name })),
                cover_image: game.cover.url,
                rating: 0,
                personal_notes: 'My notes',
                lists: listType,
                summary: game.summary || '',
                category: game.category || '',
                themes: game.themes ? game.themes.map((t) => t.name) : [],
                game_modes: game.game_modes
                    ? game.game_modes.map((mode) => mode.name)
                    : [],
                player_perspectives: game.player_perspectives
                    ? game.player_perspectives.map((perspective) => perspective.name)
                    : [],
                franchises: game.franchises
                    ? game.franchises.map((franchise) => franchise.name)
                    : [],
                developer: game.involved_companies
                    ? game.involved_companies
                        .filter((company) => company.developer)
                        .map((company) => company.company.name)
                    : [],
                publisher: game.involved_companies
                    ? game.involved_companies
                        .filter((company) => company.publisher)
                        .map((company) => company.company.name)
                    : [],
                dlc: game.dlcs ? game.dlcs.map((dlc) => dlc.name) : [],
                expansions: game.expansions
                    ? game.expansions.map((expansion) => expansion.name)
                    : [],
            });

            if (response.status === 200) {
                toast.info(`Game added to ${listType} successfully.`);
                if (listType === 'library') {
                    setCheckedPlatforms([...checkedPlatforms, platform.id]);
                }
            } else {
                toast.error('Failed to add game to library.');
            }
        } catch (error) {
            console.error('Error adding game to library:', error);
            toast.error('Failed to add game to library.');
        }
    };

    return { addGameTo };
};