/* ******* CONFIGURE ******** */
const mustache = require('mustache-express');
const bodyparser = require('body-parser');
const session = require('express-session');

const gabble = require('./gabble');

// configure mustache-express
server.engine('mustache', mustache());
server.set('views', './views')
server.set('view engine', 'mustache');

// configure body-parser
app.use(bodyparser.urlencoded({ extended: false }));

// configure sessions
app.use(session({
    secret: 'adlsfjlkha;sdf',
    resave: false,
    saveUninitialized: true
}));
