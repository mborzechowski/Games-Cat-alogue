import GoogleProvider from 'next-auth/providers/google';
import connectDB from '@/config/mongodb';
import User from '@/app/models/user'

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
        // on successful signin
        async signIn({ profile }) {
            // connect to database
            await connectDB();
            // checking if user exist
            const userExist = await User.findOne({ email: profile.email })
            // If not, then add user to database
            if (!userExist) {
                // Truncate user name if too long
                const username = profile.name.slice(0, 20);

                await User.create({
                    email: profile.email,
                    username,
                    image: profile.picture
                });


            }

            return true


        },
        // modifies the session object
        async session({ session }) {
            // Get user from database
            const user = await User.findOne({ email: session.user.email })
            // assign user id to the session
            session.user.id = user._id.toString();
            // console.log('session callback:', { session, token });

            return session

        }
    }
}

