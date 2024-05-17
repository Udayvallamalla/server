const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});

mongoose.connect('mongodb://localhost:27017/bookstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.log(err);
  throw new Error('Failed to connect to MongoDB');
});

const bookSchema = new mongoose.Schema({
  name: String,
  img: String,
  summary: String
});

const Book = mongoose.model('Book', bookSchema);

// CREATE
app.post('/books', async (req, res, next) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).send(book);
  } catch (error) {
    next(error);
  }
});

// READ all
app.get('/books', async (req, res, next) => {
  try {
    const books = await Book.find({});
    res.status(200).send(books);
  } catch (error) {
    next(error);
  }
});

// READ one by ID
app.get('/books/:id', async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).send();
    }
    res.send(book);
  } catch (error) {
    next(error);
  }
});

// UPDATE
app.patch('/books/:id', async (req, res, next) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!book) {
      return res.status(404).send();
    }
    res.send(book);
  } catch (error) {
    next(error);
  }
});

// DELETE
app.delete('/books/:id', async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).send();
    }
    res.send(book);
  } catch (error) {
    next(error);
  }
});
