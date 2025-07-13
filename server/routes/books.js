const express = require('express');
const Book = require('../models/Book');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.post('/seed', async (req, res) => {
  try {
    const sampleBooks = [
      {
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt & David Thomas",
        coverImage: "https://placehold.co/300x300/FF5733/FFFFFF?text=The+Pragmatic+Programmer",
        availability: true
      },
      {
        title: "Clean Code",
        author: "Robert C. Martin",
        coverImage: "https://placehold.co/300x300/3498DB/FFFFFF?text=Clean+Code",
        availability: true
      },
      {
        title: "Design Patterns",
        author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
        coverImage: "https://placehold.co/300x300/2ECC71/FFFFFF?text=Design+Patterns",
        availability: true
      }
    ];
    
    await Book.deleteMany({});
    const books = await Book.insertMany(sampleBooks);
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;