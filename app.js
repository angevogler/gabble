/* ******** CONGIFURE ******** */
const express = require('express');
const mustache = require('mustache-express');
const bodyparser = require('body-parser');
const session = require('express-session');
const Sequelize = require('sequelize');

const routes = require('./routes')
const gabble = require('./gabble');

// configure server
const app = express();

// configure mustache-express
app.engine('mustache', mustache());
app.set('views', './views')
app.set('view engine', 'mustache');

// configure body-parser
app.use(bodyparser.urlencoded({ extended: false }));

// configure sessions
app.use(session({
    secret: 'adlsfjlkha;sdf',
    resave: false,
    saveUninitialized: true
}));

//configure CSS
app.use(express.static('public'));

// configure routes
routes(app);

//start server
app.listen(4000);
