const express = require('express');
const bodyParser = require('body-parser');

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 3000;
// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "This is the API for BIO's association Table"});
});

require('./app/routes/association.routes.js')(app);
// listen for requests
app.listen(port, () => {
    console.log("Server is listening on port:" + port);
});

// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database: " + dbConfig.url);    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});
