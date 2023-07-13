const express = require('express');
const path = require('path');
const route = require('./src/routes');

const app = express();

app.use(route);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

app.listen(3000, () => {
  console.log('Access through http://localhost:3000');
  console.log('Server running...');
});
