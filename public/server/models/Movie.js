const dynogels = require('dynogels');
const joi = require('joi');

module.exports = dynogels.define('Movie', {
    hashKey: 'MovieId',

    timestamps: true,

    schema: {
        MovieId: joi.string(),
        UserId: joi.string(),
        Name: joi.string(),
        Plot: joi.string(),
        ImdbRating: joi.number().precision(1),
        UserRating: joi.number().precision(1),
        MpaaRating: joi.string(),
        Seen: joi.boolean(),
        Genres: joi.string(),
        Year: joi.number(),
        Actors: joi.string(),
        Runtime: joi.string(),
        imdbId: joi.string()
    },

    indexes: [{
        hashKey: 'UserId',
        name: 'UserId-index',
        type: 'global'
    }]
});