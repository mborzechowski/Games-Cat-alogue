import connectDB from '@/config/mongodb';
import UserGame from '@/app/models/game';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/utils/authOptions';
import cloudinary from '@/config/cloudinary';


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

        const formData = await req.formData();
        console.log('Form Data:', Array.from(formData.entries()));
        const gameId = formData.get('gameId');
        const rating = formData.get('rating');
        const note = formData.get('note');
        const finished = formData.get('finished');
        const lists = JSON.parse(formData.get('lists'));
        const files = formData.getAll('files');



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
        } else if (formData.has('lists')) {
            console.error('Invalid lists:', lists);
            return new Response(JSON.stringify({ message: 'Invalid lists format.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        } else {
            console.log('Lists field not provided, keeping existing value.');
        }

        if (finished) {
            game.finished = finished
        }

        if (files && files.length > 0) {
            for (const file of files) {
                const fileBuffer = await file.arrayBuffer();
                const base64Data = Buffer.from(fileBuffer).toString('base64');
                const mimeType = file.type;

                const uploadResponse = await cloudinary.uploader.upload(
                    `data:${mimeType};base64,${base64Data}`,
                    {
                        folder: 'catalogue',
                        upload_preset: 'catalogue',
                    }
                );


                game.additional_img.push({
                    url: uploadResponse.secure_url,
                    uploaded_at: new Date(),
                });
            }
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
