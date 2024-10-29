import GoogleProvider from 'next-auth/providers/google';
import connectDB from '@/config/mongodb';
import User from '@/app/models/user';

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        })
    ],
    callbacks: {
        async signIn({ profile }) {
            try {
                // Connect to the database
                await connectDB();

                // Check if user exists in the database
                const userExist = await User.findOne({ email: profile.email });

                // If user does not exist, create a new user
                if (!userExist) {
                    const username = profile.name.slice(0, 20);
                    await User.create({
                        email: profile.email,
                        username,
                        image: profile.picture
                    });
                }

                return true;
            } catch (error) {
                console.error('Error in signIn callback:', error);
                return false;
            }
        },
        async session({ session }) {
            try {
                // Ensure database connection
                await connectDB();

                // Retrieve user data
                const user = await User.findOne({ email: session.user.email });
                session.user.id = user._id.toString();

                return session;
            } catch (error) {
                console.error('Error in session callback:', error);
                return session;
            }
        }
    }
}

