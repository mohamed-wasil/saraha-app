// import { MongoClient } from "mongodb"

import mongoose from "mongoose"

// const client = new MongoClient('mongodb://localhost:27017');
// export const db = client.db('social_media_2');

// export const databaseConnection = async () => {
//     try {
//         await client.connect();
//         console.log('Connected to the database');
//     } catch (error) {
//         console.error('Failed to connect to the database', error);
//     }
// }



export const databaseConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log('Connected to the database');

    } catch (error) {
        console.error('Failed to connect to the database', error);

    }
}
