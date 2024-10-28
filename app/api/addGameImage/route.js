import connectDB from '../../../config/mongodb';
import Game from '../../models/game';

export async function POST(req) {
    const { gameId, imageUrl } = await req.json();

    try {
        await connectDB();

        const game = await Game.findByIdAndUpdate(
            gameId,
            { $push: { additional_img: { url: imageUrl } } },
            { new: true }
        );

        if (!game) {
            return new Response(JSON.stringify({ message: 'Game not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ message: 'Image added successfully', game }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error adding the image:', error);
        return new Response(JSON.stringify({ message: 'Error adding the image' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
