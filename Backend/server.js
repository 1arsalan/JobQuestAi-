const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./db/connection');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
  res.json({
    message: 'JobQuestAI Server is running!',
    features: [
      'AI Dynamic Test Generator',
      'AI Eligibility Checker',
      'AI Chatbot',
      'Dashboard with Graphs'
    ]
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});