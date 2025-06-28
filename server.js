const express = require('express');
const cors    = require('cors');
const request = require('request');

const app = express();
app.use(cors());

app.get('/proxy', (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('Missing url param');
  request({ url, followRedirect: true, headers: { 'User-Agent': 'Mozilla/5.0' } })
    .on('response', r => {
      delete r.headers['x-frame-options'];
      delete r.headers['content-security-policy'];
    })
    .pipe(res);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Proxy running on ${PORT}`));