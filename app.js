/* ******** CONGIFURE ******** */
const express = require('express');
const routes = require('./routes');

// configure server
const app = express();

// set up routes
routes(app);

//start server
app.listen(4000)
