const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    // Development Mock Mode: If no credentials or explicit mock, log to console
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('=================================================');
        console.log('MOCK EMAIL SERVICE (No Credentials Found)');
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${text}`);
        console.log('=================================================');
        return true;
    }

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
            debug: true
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        };

        const otpMatch = text.match(/\d{6}/);
        const otp = otpMatch ? otpMatch[0] : text;

        console.log("Sending OTP to:", to);
        console.log("Generated OTP:", otp);

        // Attempt to send
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to", to, "| Response:", info.response);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};

module.exports = sendEmail;
