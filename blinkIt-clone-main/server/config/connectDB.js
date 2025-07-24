import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGODB_URI) {
    throw new Error("Please provide MONGODB_URI in the .env file");
}

async function connectDB() {
    try {
        // Remove useNewUrlParser and useUnifiedTopology
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error.message, error.stack);
        process.exit(1); // Exit the process with failure
    }

    // Graceful shutdown
    process.on('SIGINT', async () => {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    });
}

export default connectDB;
