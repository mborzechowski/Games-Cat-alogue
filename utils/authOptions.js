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

                await connectDB();

                const username = profile.name.substring(0, 25);
                await User.findOneAndUpdate(
                    { email: profile.email },
                    {
                        $setOnInsert: {
                            email: profile.email,
                            username,
                            image: profile.picture,
                        }
                    },
                    { upsert: true, new: true }
                );

                return true;
            } catch (error) {
                console.error('Error in signIn callback:', error);
                return false;
            }
        },
        async session({ session }) {
            try {

                await connectDB();


                const user = await User.findOne({ email: session.user.email }).select('_id');
                if (!user) {
                    console.warn(`No user found for email: ${session.user.email}`);
                    return session;
                }

                session.user.id = user._id.toString();
                return session;
            } catch (error) {
                console.error('Error in session callback:', error);
                return session;
            }
        }
    }
}

