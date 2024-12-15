// Import the MongoDB client
const mongodb = require('mongodb'); 
const MongoClient = mongodb.MongoClient; // MongoClient for connecting to MongoDB
const ObjectID = mongodb.ObjectId; // ObjectId to work with MongoDB document IDs

let database; // Global variable to store the database connection

// Function to establish a connection to the database
async function getDatabase() {
    const client = await MongoClient.connect('mongodb://127.0.0.1:27017'); // Connect to MongoDB
    database = client.db('library'); // Access the "library" database

    // Check if the database is connected
    if (!database) {
        console.log('Database not connected');
    }

    return database; // Return the database connection
}

// Export the getDatabase function and ObjectID
module.exports = {
    getDatabase,
    ObjectID
};
