// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
const User = require('../models/user');

if(!process.env.SENDGRID_API_KEY) {
    throw new Error('Missing SENDGRID_API_KEY environment var');
}

if(!process.env.KYC_NOTIFY_EMAIL_RECIPIENTS) {
    throw new Error('Missing KYC_NOTIFY_EMAIL_RECIPIENTS environment var');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const notifyAdminAboutKycSubmited = (kyc, files) => {
    const fullName = kyc.full_name;

    if(process.env.EMAIL_NOTIFICATIONS_SILENT === 'true') {
        console.log('SILENT EMAIL TO KYC ADMIN', '...');
        return 'SILENT EMAIL';
    }

    let images;
    if(files.identification_back_image) {
        images = [files.identification_front_image[0], files.identification_back_image[0], files.identification_selfie_image[0]];
    } else {
        images = [files.identification_front_image[0], files.identification_selfie_image[0]];
    }

    const attachments = images.map((img) => {
        return {
            content: img.buffer.toString('base64'),
            filename: img.originalname,
            type: img.mimetype,
            disposition: 'attachment',
            content_id: img.fieldname
        };
    });

    const recipients = process.env.KYC_NOTIFY_EMAIL_RECIPIENTS.split(',').map((email) => email.trim());
    console.log('(notifyAdminAboutKycSubmited) ', {
        to: recipients,
        from: process.env.KYC_NOTIFY_EMAIL_FROM_EMAIL,
        subject: `${fullName} submited KYC`
    });

    const msg = {
        to: recipients,
        from: process.env.KYC_NOTIFY_EMAIL_FROM_EMAIL,
        subject: `${fullName} submited KYC`,
        text: kyc.getDataInfo('\n'),
        html: kyc.getDataInfo(),
        attachments: attachments,
    };

    return sgMail.send(msg);

};

const notifyUserAboutKycSubmitted = async (kyc, req) => {
    const fullName = kyc.full_name;

    if(process.env.EMAIL_NOTIFICATIONS_SILENT === 'true') {
        console.log('SILENT EMAIL TO KYC USER', '...');
        return 'SILENT EMAIL';
    }

    const emailText = `
        Dear ${fullName},<br>
        Thank you for logging in to the RSong platform and submitting your KYC application. It will be reviewed and you will be notified by email when the process is complete.<br><br>
        Thanks again and please don’t hesitate to contact us if you should have any questions about RSong!<br><br>
        RSong Administration<br>
    `;

    const user = await User.findById(req.user.id).populate('gmail_account facebook_account');

    const msg = {
        to: user.email,
        from: process.env.KYC_NOTIFY_EMAIL_FROM_EMAIL,
        subject: `You have sucesfully submited KYC`,
        text: emailText,
        html: emailText,
    };

    console.log('Trying to notify user via email ...', {
        to: user.email,
        from: process.env.KYC_NOTIFY_EMAIL_FROM_EMAIL,
        subject: `You have sucesfully submited KYC`,
    });

    return sgMail.send(msg);

};

const sendEmailWithVerificationCode = (to, code) => {
    const message = `RSong email Verification code is ${code}`;
    const msg = {
        to: to,
        from: process.env.KYC_NOTIFY_EMAIL_FROM_EMAIL,
        subject: message,
        text: message,
        html: message,
    };

    console.log('Trying to send email ...', {
        to: to,
        from: process.env.KYC_NOTIFY_EMAIL_FROM_EMAIL,
        subject: message,
    });

    return sgMail.send(msg);
};

module.exports = {
    notifyAdminAboutKycSubmited,
    notifyUserAboutKycSubmitted,
    sendEmailWithVerificationCode
};