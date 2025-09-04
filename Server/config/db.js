import mongoose from "mongoose";

const connectDB = async () => {
        try {
            mongoose.connection.on('connected', () => console.log('MongoDB connected!'));
            const conn = await mongoose.connect(`${process.env.MONGO_URL}/atom-social`);

        } catch (error) {
            console.log(`Error: ${error.message}`);
            process.exit(1);
        }
}

export default connectDB;