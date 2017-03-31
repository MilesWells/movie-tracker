const dynogels = require('dynogels');
const joi = require('joi');

module.exports = dynogels.define('MovieUser', {
    hashKey: 'UserId',

    timestamps: true,

    schema: {
        UserId: joi.string(),
        isAdmin: joi.boolean(),
        Email: joi.string().email(),
        Name: joi.string(),
        Password: joi.string(),
        Banned: joi.boolean()
    },

    indexes: [{
        hashKey: 'Email',
        name: 'Email-index',
        type: 'global'
    }]
});