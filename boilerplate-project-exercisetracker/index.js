const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const res = require('express/lib/response')

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use('/', bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// ========== Schema Begin ===========
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  exercises: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Exercise"
  }]
});

const User = mongoose.model("User", userSchema);

const exerciseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

const Exercise = mongoose.model("Exercise", exerciseSchema);
// ========== Schema End ===========

// create a new user
app.post('/api/users', (req, res, next) => {
  const username = req.body.username;
  let user = new User({ username: username });

  user.save().then((doc) => {
    res.json({ username: doc.username, _id: doc.id });
  }).catch((err) => {
    console.error(err);
  });
});

// get all users list
app.get('/api/users', (req, res) => {
  User.find().then((doc) => {
    let docs = [];
    doc.forEach(document => {
      if (document.username && document.id) {
        docs.push({ username: document.username, _id: document.id });
      }
    });
    res.json(docs);
  }).catch((err) => {
    console.error(err);
  });
});

// create a new exercise
app.post('/api/users/:_id/exercises', async (req, res) => {
  let owner_id = req.params._id;
  let description = req.body.description;
  let duration = req.body.duration;
  let username;
  let date;

  User.findById(owner_id).then((doc) => {
    username = doc.username;
  });

  if (req.body.date) {
    date = new Date(req.body.date).toDateString();
  } else {
    date = new Date().toDateString();
  }

  let exercise = new Exercise({
    date: date,
    description: description,
    duration: duration,
    owner: owner_id
  });

  await exercise.save().then((doc) => {
    res.json({
      _id: owner_id,
      username: username,
      date: doc.date.toDateString(),
      duration: doc.duration,
      description: doc.description
    });
  }).catch((err) => {
    console.error(err);
  });
});

// Get user's exercise logs
app.get('/api/users/:_id/logs', async (req, res) => {
  try {
    const _id = req.params._id;
    const { from, to, limit } = req.query;

    const user = await User.findById(_id);
    if (!user) {
      console.error('error: User not found');
    }

    const query = { owner: _id };
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) query.date.$lt = new Date(to);
    }

    let exercises = await Exercise.find(query).limit(parseInt(limit) || 0);

    exercises = exercises.map((exercise) => ({
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString()
    }));

    res.json({
      _id,
      username: user.username,
      count: exercises.length,
      log: exercises
    });
  } catch (err) {
    console.error(err);
  }
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
