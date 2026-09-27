const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

const passport = require('passport');
const UserModel = require('../modules/user.model');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:9005/api/v1/auth/google/callback"
},
    async (accessToken, refreshToken, profile, cb) => {
        try {

            let user = await UserModel.findOne({ googleId: profile.id });

            if (!user) {
                user = await UserModel.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    image: profile.photos[0].value,
                    status: "active"
                })
            }

            return cb(null, user)

        } catch (error) {
            console.log(error)
            return cb(error, null)
        }

    }
));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:9005/api/v1/auth/facebook/callback",
    profileFields: ["id", "displayName", "emails", "photos"],
},
    async (accessToken, refreshToken, profile, cb) => {
        try {
            let user = await UserModel.findOne({ facebookId: profile.id });
            console.log(profile)

            if (!user) {
                user = await UserModel.create({
                    facebookId: profile.id,
                    name: profile.displayName,
                    email: profile.emails?.[0]?.value || null,
                    image: profile.photos?.[0]?.value || null,
                    status: "active"
                })
            }
            return cb(null, user);

        } catch (error) {
            console.log(error)
            return cb(error, null)
        }
    }
));
