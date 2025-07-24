import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

const sendEmail = async({sendTo, subject, html })=>{
    try {
        console.log('Attempting to send email to:', sendTo);
        console.log('Email subject:', subject);

        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: sendTo,
            subject: subject,
            html: html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Email sending failed:', error);
        throw error;
    }
}

export default sendEmail;

