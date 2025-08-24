import { connect, disconnect } from "mongoose";

async function connectToDatabase() {
    try {
        await connect(process.env.MONGODB_URL as string);
        console.log("Connected to MongoDB.");
    } catch (error) {
        console.error(error);
        throw new Error("Cannot connect to MongoDB.");
    }
}

async function disconnectFromDatabase() {
    try {
        await disconnect();
        console.log("Disconnected from MongoDB.");
    } catch (error) {
        console.error(error);
        throw new Error("Cannot disconnect from MongoDB.");
    }
}

export { connectToDatabase, disconnectFromDatabase };
