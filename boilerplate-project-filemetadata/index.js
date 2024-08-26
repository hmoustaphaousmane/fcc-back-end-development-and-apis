var express = require('express');
var cors = require('cors');
require('dotenv').config()
const fs = require('fs');
const multer = require('multer');

var app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  const upfile = req.file;

  const name = upfile.originalname;
  const type = upfile.mimetype;
  const size = upfile.size;
  res.send({ name: name, type: type, size: size });
});


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
