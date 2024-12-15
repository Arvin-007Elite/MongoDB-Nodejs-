// Import necessary modules
const express = require('express'); // Express for creating a web server
const app = express(); // Initialize the Express application
const bodyparser = require('body-parser'); // Body-parser to parse form data
const exhbs = require('express-handlebars'); // Handlebars for templating
const dbo = require('./db'); // Import the database connection logic
const ObjectID = dbo.ObjectID; // Import ObjectID for MongoDB to work with document IDs

// Configure Handlebars as the view engine
app.engine('hbs', exhbs.engine({ 
    layoutsDir: 'views/', // Directory for layout files
    defaultLayout: "main", // Default layout to use
    extname: "hbs" // File extension for handlebars files
}));
app.set('view engine', 'hbs'); // Set handlebars as the default view engine
app.set('views', 'views'); // Specify the directory for view templates

// Middleware to parse incoming form data
app.use(bodyparser.urlencoded({ extended: true })); 

// Route: Home page
app.get('/', async (req, res) => {
    let database = await dbo.getDatabase(); // Get the database connection
    const collection = database.collection('books'); // Access the "books" collection
    const cursor = collection.find({}); // Query to retrieve all documents from "books" collection
    let books = await cursor.toArray(); // Convert cursor results to an array

    let message = ''; // Initialize message for success/failure notifications
    let edit_id, edit_book; // Variables for editing functionality

    // Check if there's an edit request
    if (req.query.edit_id) {
        edit_id = req.query.edit_id; // Get the ID of the book to be edited
        edit_book = await collection.findOne({ _id: new ObjectID(edit_id) }); // Fetch the book details
    }

    // Check if there's a delete request
    if (req.query.delete_id) {
        await collection.deleteOne({ _id: new ObjectID(req.query.delete_id) }); // Delete the book with the given ID
        return res.redirect('/?status=3'); // Redirect to the home page with status code 3 (Deleted)
    }

    // Map status codes to user-friendly messages
    switch (req.query.status) {
        case '1':
            message = 'Inserted Successfully!';
            break;
        case '2':
            message = 'Updated Successfully!';
            break;
        case '3':
            message = 'Deleted Successfully!';
            break;
        default:
            break;
    }

    // Render the main template with data
    res.render('main', { 
        message, // Pass success/error message
        books, // Pass the list of books
        edit_id, // Pass the ID of the book being edited
        edit_book // Pass the book data for editing
    });
});

// Route: Add a new book
app.post('/store_book', async (req, res) => {
    let database = await dbo.getDatabase(); // Get the database connection
    const collection = database.collection('books'); // Access the "books" collection
    let book = { 
        title: req.body.title, // Get the book title from the form
        author: req.body.author // Get the author from the form
    };
    await collection.insertOne(book); // Insert the book into the collection
    return res.redirect('/?status=1'); // Redirect to home with status code 1 (Inserted)
});

// Route: Update an existing book
app.post('/update_book/:edit_id', async (req, res) => {
    let database = await dbo.getDatabase(); // Get the database connection
    const collection = database.collection('books'); // Access the "books" collection
    let book = { 
        title: req.body.title, // Get the updated book title
        author: req.body.author // Get the updated author
    };
    let edit_id = req.params.edit_id; // Get the ID of the book being updated

    await collection.updateOne(
        { _id: new ObjectID(edit_id) }, // Filter: Find the book by ID
        { $set: book } // Update the book fields
    );
    return res.redirect('/?status=2'); // Redirect to home with status code 2 (Updated)
});

// Start the Express server
app.listen(8000, () => { 
    console.log('Listening to 8000 port'); // Log server startup
});
