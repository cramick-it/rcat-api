// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');


const notifyKYC = (kycData, files) => {

    if(process.env.EMAIL_NOTIFICATIONS_SILENT === 'true') {
        console.log('SILENT EMAIL', '...');
        return resolve('SILENT');
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: process.env.KYC_NOTIFY_EMAIL_RECIPIENTS,
        from: process.env.KYC_NOTIFY_EMAIL_FROM_EMAIL,
        subject: 'KYC submited',
        text: 'TODO ... fill with data :)',
        html: '<strong>TODO ... fill with data ... aa ... bbb ... ccc</strong>',
    };

    return sgMail.send(msg);

};


module.exports = {
    notifyKYC
};