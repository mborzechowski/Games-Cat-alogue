import connectDB from '@/config/mongodb';
import User from '@/app/models/user';
import UserGame from '@/app/models/game';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import cloudinary from '@/config/cloudinary';
import { log } from 'console';

export async function PUT(req) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.id) {
            return new Response(JSON.stringify({ message: 'User not authenticated.' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { gameId, rating, note, fileData, lists, finished } = await req.json();



        if (!gameId) {
            return new Response(JSON.stringify({ message: 'Game ID is required.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const game = await UserGame.findOne({
            _id: gameId,
            user_id: session.user.id
        });

        if (!game) {
            return new Response(JSON.stringify({ message: 'Game not found.' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (rating !== undefined) {
            game.rating = rating;
        }
        if (note) {
            game.note = note;
        }

        if (lists && Array.isArray(lists)) {
            game.lists = lists;
        }

        if (finished) {
            game.finished = finished
        }

        if (fileData) {
            const base64Data = fileData.split(',')[1];
            const uploadResponse = await cloudinary.uploader.upload(`data:image/png;base64,${base64Data}`, {
                folder: 'catalogue',
                upload_preset: 'catalogue',
            });
            console.log("secure url", uploadResponse.secure_url);

            game.additional_img.push({
                url: uploadResponse.secure_url,
                uploaded_at: new Date()
            });
        }

        await game.save();


        return new Response(JSON.stringify(game), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ message: 'Server error.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });

    }
}
