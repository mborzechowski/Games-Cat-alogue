export const deleteGame = async (gameId) => {
    try {
        const response = await fetch(`/api/deleteGame?gameId=${gameId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete game');
        }
        return response.json();
    } catch (error) {
        console.error('Error deleting game:', error);
        throw error;
    }
};