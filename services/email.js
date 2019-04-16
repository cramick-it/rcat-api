// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');


const notifyAdminAboutKycSubmited = (kyc, files) => {
    const fullName = kyc.full_name;

    if(process.env.EMAIL_NOTIFICATIONS_SILENT === 'true') {
        console.log('SILENT EMAIL TO KYC ADMIN', '...');
        return 'SILENT EMAIL';
    }

    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log('files >>>>>>>>>>>>>>>>>>>>>>>>>>>>>', files);
    const images = [files.identification_front_image[0], files.identification_back_image[0], files.identification_selfie_image[0]];

    const attachments = images.map((img) => {
        return {
            content: img.buffer.toString('base64'),
            filename: img.originalname,
            type: img.mimetype,
            disposition: 'attachment',
            content_id: img.fieldname
        };
    });

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: process.env.KYC_NOTIFY_EMAIL_RECIPIENTS,
        from: process.env.KYC_NOTIFY_EMAIL_FROM_EMAIL,
        subject: `${fullName} submited KYC`,
        text: kyc.getDataInfo('\n'),
        html: kyc.getDataInfo(),
        attachments: attachments,
    };

    return sgMail.send(msg);

};

const notifyUserAboutKycSubmitted = (kyc) => {
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

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: process.env.KYC_NOTIFY_EMAIL_RECIPIENTS,
        from: process.env.KYC_NOTIFY_EMAIL_FROM_EMAIL,
        subject: `You have sucesfully submited KYC`,
        text: emailText,
        html: emailText,
    };

    return sgMail.send(msg);

};


module.exports = {
    notifyAdminAboutKycSubmited,
    notifyUserAboutKycSubmitted,
};