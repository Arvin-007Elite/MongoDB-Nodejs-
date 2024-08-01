const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the Book model
const bookSchema = new Schema({
    title: String,
    author: String,
    // You can add more fields as needed
});

// Create a model based on the schema
const Book = mongoose.model('Book', bookSchema); // Changed 'book' to 'Book'

// Export the Book model
module.exports = Book; // Exporting the model directly
