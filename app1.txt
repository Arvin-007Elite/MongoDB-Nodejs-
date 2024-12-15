const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const exhbs = require("express-handlebars");
const { getDatabase } = require("./db1");
const Book = require("./models/bookModel");

app.engine(
  "hbs",
  exhbs.engine({
    layoutsDir: "views/",
    defaultLayout: "main1",
    extname: "hbs",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", "hbs");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    await getDatabase(); // Connect to the database

    const books = await Book.find({}); // Fetch all books

    // Initialize edit variables
    let edit_id, edit_book;
    if (req.query.edit_id) {
      edit_id = req.query.edit_id;
      edit_book = await Book.findById(edit_id);
    }

    // Handle delete operation
    if (req.query.delete_id) {
      await Book.findByIdAndDelete(req.query.delete_id);
      return res.redirect("/?status=3");
    }

    // Set status messages for different operations
    let message = "";
    switch (req.query.status) {
      case "1":
        message = "Inserted Successfully";
        break;
      case "2":
        message = "Updated Successfully";
        break;
      case "3":
        message = "Deleted Successfully";
        break;
      default:
        break;
    }

    // Render the main view with the necessary data
    res.render("main1", { message, books, edit_id, edit_book });
  } catch (error) {
    console.error("Failed to fetch data from the database:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/store_book", async (req, res) => {
  try {
    await getDatabase(); // Connect to the database

    const { title, author } = req.body;
    const book = new Book({ title, author }); // Use Book instead of BookModel
    await book.save();

    return res.redirect("/?status=1");
  } catch (error) {
    console.error("Failed to store book:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/update_book/:edit_id", async (req, res) => {
  try {
    await getDatabase(); // Connect to the database

    const { title, author } = req.body;
    await Book.findByIdAndUpdate(req.params.edit_id, { title, author });

    return res.redirect("/?status=2");
  } catch (error) {9
    console.error("Failed to update book:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(8000, () => {
  console.log("Listening on port 8000");
});
