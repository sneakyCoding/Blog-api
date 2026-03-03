import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI environment variable is not set");
        }
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB failed to connect:", err.message);
        process.exit(1);
    }
};