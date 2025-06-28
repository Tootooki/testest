const express = require('express');
const cors    = require('cors');
const request = require('request');
const path    = require('path');

const app = express();
app.use(cors());

// serve static files (index.html)
app.use(express.static(path.join(__dirname)));

app.get('/proxy', (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('Missing url param');
  request({
    url,
    followRedirect: true,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36'
    }
  })
    .on('response', r => {
      delete r.headers['x-frame-options'];
      delete r.headers['content-security-policy'];
    })
    .pipe(res);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Proxy running on ${PORT}`));
