// Imports
const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./apiRouter').router;

// Instantiate server
const server = express();

// Body Parser configuration
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

// configure route
server.get('/', function (req,res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('<h1>bonjour</h1>');
});
server.use('/api/', apiRouter);

// Ecoute du serveur
server.listen(8080, () => console.log('server started'));