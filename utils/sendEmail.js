const sgMail = require('@sendgrid/mail');
const logger = require('../startup/logging');

sgMail.setApiKey(process.env.GMAIL_API_KEY);

function sendmail(to,otpCode){  
  const msg = {
    to,
    from: process.env.WEB_SITE_GMAIL,
    subject:"رمز التحقق الخاص بك هو هنا",
    text: `Your OTP is: ${otpCode}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #007BFF;">🔐 رمز التحقق (OTP)</h2>
        <p>مرحبًا!</p>
        <p>كود التحقق الخاص بك هو:</p>
        <h1 style="background: #f0f0f0; padding: 15px; border-radius: 8px; color: #333; text-align: center;">
          ${otpCode}
        </h1>
        <p>هذا الرمز صالح لمدة <strong>5 دقائق</strong>.</p>
        <p style="margin-top: 30px;">شكراً لاستخدامك منصتنا ❤️</p>
      </div>
    `};
  
  sgMail
  .send(msg)
  .then(response => {
    logger.log('✅ Email sent successfully');
    logger.log('📩 SendGrid Response Status:', response[0].statusCode);
    logger.log('📬 Response Headers:', response[0].headers);
  })
  .catch((error) => {
    logger.error('❌ Error sending email:', error);
    logger.error('❌ Error sending email body:', error.body);
  });
  
}

module.exports=sendmail;