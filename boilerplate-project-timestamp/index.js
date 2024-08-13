// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/:date?", (req, res) => {
  const dateParam = req.params.date;
  let date;
  let unixTimestamp;

  if (!dateParam || dateParam.trim() === ""){
    date = new Date();
    unixTimestamp = Math.floor(date.getTime());
  } else {
    if (isNaN(Number(dateParam))) {
      // create a Date object with the provided date-time string
      date = new Date(dateParam);

      // if the input date string is invalid
      if (isNaN(date)) {
        res.json({ error: 'Invalid Date'});
      }

      // get the unix timestamp in milliseconds
      unixTimestamp = Math.floor(date.getTime());
    } else {
      unixTimestamp = Number(dateParam);
      date = new Date(unixTimestamp);
    }
  }

  // format the date as "Fri, 25 Dec 2015 00:00:00 GMT"
  const formattedDate = [
    date.toLocaleDateString('en-Uk', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }),
    date.toLocaleTimeString('en-Uk', { hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'shortOffset' })
  ].join(' ');

  res.json({unix: unixTimestamp, utc: formattedDate});
});


// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
