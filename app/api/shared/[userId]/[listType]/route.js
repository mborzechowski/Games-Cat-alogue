import { NextResponse } from 'next/server';
import connectDB from '@/config/mongodb';
import UserGameSchema from '@/app/models/game';


export async function GET(req, { params }) {
    const { userId, listType } = params;

    if (!userId || !listType) {
        return NextResponse.json(
            { error: 'User ID and list type are required.' },
            { status: 400 }
        );
    }

    try {
        const games = await fetchGamesByUserAndList(userId, listType);
        return NextResponse.json(games);
    } catch (error) {
        console.error('Error fetching shared list:', error);
        return NextResponse.json(
            { error: 'Error fetching list.' },
            { status: 500 }
        );
    }
}

const fetchGamesByUserAndList = async (userId, listType) => {
    try {
        await connectDB();
        const listMapping = {
            'wishlist': 'wishlist',
            'Wishlist': 'wishlist',
            'Next in line': 'next',
            'On loan': 'loan',
            'On hold': 'hold',
            'On sale': 'sale',
        };


        const mappedList = listMapping[listType];
        if (!mappedList) {
            throw new Error('Invalid list type.');
        }

        const games = await UserGameSchema.find({ user_id: userId, lists: mappedList }).exec();


        return games;
    } catch (error) {
        console.error('Error fetching games by user and list:', error);
        throw new Error('Failed to fetch games.');
    }
};