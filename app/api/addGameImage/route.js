import connectDB from '../../../config/mongodb';
import Game from '../../models/game';

export default async function handler(req, res) {
    const { gameId, imageUrl } = req.body;

    try {
        await connectDB();

        const game = await Game.findByIdAndUpdate(
            gameId,
            { $push: { additional_img: { url: imageUrl } } },
            { new: true }
        );

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        res.status(200).json({ message: 'Image added successfully', game });
    } catch (error) {
        console.error('Error adding the image:', error);
        res.status(500).json({ message: 'Error adding the image' });
    }
}
