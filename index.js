const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const app = express();
const fetch = require('node-fetch');

app.get('/', (req, res) => res.send('money manager root get request'));

app.listen(process.env.PORT  || 3001, console.log(`app is running on port ${process.env.PORT}, or 3001`))