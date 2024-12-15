const mongoose = require('mongoose');

async function getDatabase() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/library', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        throw error; // Rethrow the error to handle it in calling functions
    }
}

module.exports = {
    getDatabase,
    mongoose,
};
