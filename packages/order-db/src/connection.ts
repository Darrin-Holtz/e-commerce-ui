import mongoose from 'mongoose';

let isConnected = false;

export const connectOrderDB = async () => {
    if (isConnected) {
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URL as string);
        isConnected = true;
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log(error)
        throw error;
    }
}