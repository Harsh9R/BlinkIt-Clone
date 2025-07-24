// Add this new function to handle Google authentication
const googleAuth = async (req, res) => {
    try {
        const { token, name, email, photoURL } = req.body;
        
        if (!token || !email) {
            return res.status(400).json({
                success: false,
                message: "Token and email are required"
            });
        }
        
        // Check if user already exists
        let user = await User.findOne({ email });
        
        if (!user) {
            // Create new user if not exists
            user = await User.create({
                name: name || "User",
                email,
                avatar: photoURL || "",
                verify_email: true,
                status: "active",
                role: "USER"
            });
        }
        
        // Generate tokens
        const accesstoken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        
        // Update last login date
        user.last_login_date = new Date();
        await user.save();
        
        return res.status(200).json({
            success: true,
            message: "Google authentication successful",
            data: {
                accesstoken,
                refreshToken
            }
        });
    } catch (error) {
        console.error("Google auth error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Make sure to export the new function
module.exports = {
    // ... existing exports ...
    googleAuth,
    // ... existing exports ...
}; 