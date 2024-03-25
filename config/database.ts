import mongoose from "mongoose";

export const connect = async (): Promise<void> => {
    mongoose.connect(process.env.MONGO_URL);
    await console.log("Connected to database!");
}