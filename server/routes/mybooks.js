const express = require('express');
const MyBook = require('../models/MyBook');
const Book = require('../models/Book');
const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const myBooks = await MyBook.find({ userId: req.userId }).populate('bookId');
    res.json(myBooks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;
    
    
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    

    const existingMyBook = await MyBook.findOne({ 
      userId: req.userId, 
      bookId 
    });
    
    if (existingMyBook) {
      return res.status(400).json({ message: 'Book already in your collection' });
    }
    
  
    const myBook = new MyBook({
      userId: req.userId,
      bookId,
      status: 'Want to Read'
    });
    
    await myBook.save();
    
    res.status(201).json(myBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.patch('/:bookId/status', async (req, res) => {
  try {
    const { bookId } = req.params;
    const { status } = req.body;
    
    if (!['Want to Read', 'Currently Reading', 'Read'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const myBook = await MyBook.findOneAndUpdate(
      { userId: req.userId, bookId },
      { status },
      { new: true }
    ).populate('bookId');
    
    if (!myBook) {
      return res.status(404).json({ message: 'Book not found in your collection' });
    }
    
    res.json(myBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.patch('/:bookId/rating', async (req, res) => {
  try {
    const { bookId } = req.params;
    const { rating } = req.body;
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    const myBook = await MyBook.findOneAndUpdate(
      { userId: req.userId, bookId },
      { rating },
      { new: true }
    ).populate('bookId');
    
    if (!myBook) {
      return res.status(404).json({ message: 'Book not found in your collection' });
    }
    
    res.json(myBook);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;