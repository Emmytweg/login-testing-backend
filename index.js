const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// const allowedOrigins = ['http://localhost:3000', 'https://login-testing-ui.vercel.app'];
app.use(cors())
// app.use(cors({
//   origin: function(origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     } else {
//       return callback(new Error('Not allowed by CORS'), false);
//     }
//   }
// }));

app.use(express.json());

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ DB error:', err));

// User schema
const User = mongoose.model('User', new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

// Signup route
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'All fields required' });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashed });
  await user.save();
  res.status(201).json({ message: 'User registered' });
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
