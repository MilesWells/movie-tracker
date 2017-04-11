const dynogels = require('dynogels');
const joi = require('joi');

module.exports = dynogels.define('Movie', {
    hashKey: 'MovieId',

    timestamps: true,

    schema: {
        MovieId: joi.string(),
        UserId: joi.string(),
        Title: joi.string(),
        Plot: joi.string(),
        ImdbRating: joi.number().precision(1).allow(null),
        UserRating: joi.number().allow(null),
        MpaaRating: joi.string(),
        Seen: joi.boolean(),
        Genres: joi.string(),
        Year: joi.number(),
        Actors: joi.string(),
        Runtime: joi.string(),
        ImdbId: joi.string(),
        Director: joi.string(),
        Writer: joi.string(),
        Languages: joi.string(),
        Website: joi.string()
    },

    indexes: [{
        hashKey: 'UserId',
        name: 'UserId-index',
        type: 'global'
    },
    {
        hashKey : 'UserId',
        rangeKey : 'Title',
        name : 'Title-index',
        type : 'global',
    }]
});