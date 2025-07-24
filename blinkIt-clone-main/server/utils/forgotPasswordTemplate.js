const forgotPasswordTemplate = ({ name, otp }) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4F46E5;">Password Reset Request</h2>
            <p>Hello ${name},</p>
            <p>You have requested to reset your password. Please use the following OTP to proceed:</p>
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
                <h1 style="color: #4F46E5; margin: 0;">${otp}</h1>
            </div>
            <p>This OTP will expire in 1 hour.</p>
            <p>If you did not request this password reset, please ignore this email.</p>
            <p>Best regards,<br>Ecom Team</p>
        </div>
    `;
};

export default forgotPasswordTemplate;