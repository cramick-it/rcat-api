const jwt = require('jsonwebtoken');
const FacebookAccount = require('../models/facebook-account');

const passport = require('passport');
const { facebookTokenStrategy } = require('../services/facebook');
passport.use(facebookTokenStrategy);

// call Facebook's API to check if passed token is valid
const verifyFacebookToken = async (req, res) => {
    return new Promise((resolve, reject) => {
        passport.authenticate('facebook-token', {session: false}, function (err, data, info) {
            if (!!err) {
                reject(err);
            }
            resolve(data);
        })(req, res);
    });
};

const loginFacebook = async (req, res) => {
    const facebookResult = await verifyFacebookToken(req, res);
    const {
        accessToken,
        refreshToken,
        profile
    } = facebookResult;
    console.log('profile', profile);

    const {
        id: facebookId,
        displayName,
        name: userData,
        emails,
        photos
    } = profile;

    const facebookLoginData = {
        facebookId: facebookId,
        displayName: displayName,
        email: emails[0].value,
        profile_picture_url: photos[0].value
    };
    console.log('facebookLoginData >>>', facebookLoginData);
    const user = await FacebookAccount.login(facebookLoginData);
    console.log('user >>>', user);

    if(facebookId !== user.facebook_account.facebook_id) {
        return {
            statusCode: 400,
            error: "Bad Request",
            message: "Token mismatch"
        }
    }

    const jwtPayload = {
        id:  user._id,
        email: user.facebook_account.email,
        name: displayName,
        auth_provider: 'facebook'
    };

    console.log('jwtPayload >>>>', jwtPayload);

    const jwtOptions = require('../config/jwt-options');
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, jwtOptions);

    return {
        token,
        require_kyc: user.require_kyc,
        user
    };

};

module.exports = {
    loginFacebook
};