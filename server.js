const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/quiz', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const questionSchema = new mongoose.Schema({
  category: String,
  difficulty: String,
  question: String,
  correct_answer: String,
  incorrect_answers: [String],
});

const Question = mongoose.model('Question', questionSchema);

app.get('/api/questions', async (req, res) => {
  const { category, difficulty, numQuestions } = req.query;

  const query = {};
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;

  const num = parseInt(numQuestions, 10);
  if (isNaN(num) || num <= 0) {
    return res.status(400).json({ error: 'Invalid number of questions' });
  }

  try {
    const questions = await Question.find(query).limit(num);
    res.json(questions);
  } catch (err) {
    console.error('Error fetching questions:', err.message);
    res.status(500).json({ error: 'An error occurred while fetching questions' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
