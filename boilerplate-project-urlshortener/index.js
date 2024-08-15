require('dotenv').config();
const { URL } = require('url')
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

// app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', bodyParser.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urls = []

app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  const urlIndex = urls.indexOf(originalUrl);

  // if (!originalUrl.inculdes("https://") && !originalUrl.inculdes("http://")) {
  //   res.jsonjson({ error: "invalid url" })
  // }
  if (!originalUrl.toString().includes('https://') && !originalUrl.toString().includes('http://')) {
    return res.json({ error: "invalid url" });
  }

  if(urlIndex < 0) {
    urls.push(originalUrl);

    return res.json({ original_url: originalUrl, short_url: urls.indexOf(originalUrl)})
  }

  return res.json({ original_url: originalUrl, short_url: urlIndex }); 
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = parseInt(req.params.short_url);
  if (shortUrl) {
    res.redirect(urls[shortUrl]);
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
