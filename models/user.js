const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Types } = Schema;

const userSchema = new mongoose.Schema({
    kyc_account: {
        type: Types.ObjectId,
        ref: 'KycAccount',
    },
    gmail_account: {
        type: Types.ObjectId,
        ref: 'GmailAccount',
    },
});

userSchema.statics.getKycAccountId = async function (userData) {
    console.log('(getKycAccountId) userData: ', userData);
    const user = await User.findById(userData.id, '-__v');
    console.log('(getKycAccountId) user: ', user);
    return user.kyc_account;
};

const User = mongoose.model('User', userSchema);
module.exports = User;