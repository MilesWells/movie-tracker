const dynogels = require('dynogels');

//set up AWS credentials
dynogels.AWS.config.loadFromPath('./public/server/config/credentials.json');

//require models for dynogels
const User = require('../models/User');
const Movie = require('../models/Movie');

//create tables for dynogels
dynogels.createTables((error) => {
    if(error) {
        console.log(error);
        throw error;
    }
});

module.exports = {
    User: User,
    Movie: Movie
};