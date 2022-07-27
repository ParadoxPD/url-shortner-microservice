require('dotenv').config();



const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const connection = require('./connection')
const URLSchema = require('./URLSchema')

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json())


const port = process.env.PORT || 3000;


const Url = mongoose.model('Url', URLSchema);

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get("/api/shorturl/:input", (req, res) => {
  const input = parseInt(req.params.input);

  Url.findOne({
    short: input
  }, function (err, data) {
    if (err || data === null) return res.json("URL NOT FOUND")
    return res.redirect(data.original);
  });
})

app.post("/api/shorturl", async (req, res) => {
  const bodyUrl = req.body.url;
  let urlRegex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/);

  if (!bodyUrl.match(urlRegex)) {
    return res.json({
      error: "Invalid URL"
    });
  }

  let index = 1;

  Url.findOne({})
    .sort({
      short: 'desc'
    })
    .exec((err, data) => {
      if (err) return res.json({
        error: "No url found."
      })

      index = data !== null ? data.short + 1 : index;

      Url.findOneAndUpdate({
          original: bodyUrl
        }, {
          original: bodyUrl,
          short: index
        }, {
          new: true,
          upsert: true
        },
        (err, newUrl) => {
          if (!err) {
            res.json({
              original_url: bodyUrl,
              short_url: newUrl.short
            })
          }
        }
      )
    })
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});