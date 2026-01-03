import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/user.model.js';

const configurePassport = () => {
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
        passport.use(
            new GoogleStrategy(
                {
                    clientID: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:7000/api/v1/auth/google/callback',
                },
                async (accessToken, refreshToken, profile, done) => {
                    try {
                        let user = await User.findOne({ googleId: profile.id });

                        if (user) {
                            return done(null, user);
                        }

                        user = await User.findOne({ email: profile.emails[0].value });

                        if (user) {
                            user.googleId = profile.id;
                            user.authProvider = 'google';
                            await user.save();
                            return done(null, user);
                        }

                        user = await User.create({
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            googleId: profile.id,
                            authProvider: 'google',
                            avatar: profile.photos?.[0]?.value || 'https://via.placeholder.com/150',
                            phone: 'Not provided',
                            location: 'Not provided',
                            primaryCrops: 'Not specified',
                        });

                        done(null, user);
                    } catch (error) {
                        done(error, null);
                    }
                }
            )
        );
        console.log('Google OAuth strategy configured');
    } else {
        console.log('Google OAuth not configured');
    }
};

export default configurePassport;
