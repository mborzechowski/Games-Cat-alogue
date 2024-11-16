import { NextResponse } from 'next/server';
import connectDB from '@/config/mongodb';
import User from '@/app/models/user';

export async function GET(request, { params }) {
    const { userId } = params;

    if (!userId) {
        return NextResponse.json(
            { error: 'User ID is required.' },
            { status: 400 }
        );
    }

    try {
        await connectDB();
        const user = await User.findById(userId).select('username image').exec();

        if (!user) {
            return NextResponse.json(
                { error: 'User not found.' },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user data.' },
            { status: 500 }
        );
    }
}