// config/passport.js

// load all the things we need
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const uuid = require('uuid');
const Dynamo = require('./dynamoDB');

// expose this function to our app using module.exports
module.exports = function(passport) {

	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser((user, done) => {
        Dynamo.User.get(user.UserId, (error, data) => {
            if(error) {
                console.log(error, data);
                throw error;
            }

            done(error, data);
        });
    });

 	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for register
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-register', new LocalStrategy({
        passReqToCallback : true // allows us to pass back the entire request to the callback
    }, (req, email, password, done) => {
        //get parameters form request body
        const confirmPassword = req.body.confirmPassword;
        const name = req.body.name;

        if(!name || name.trim().length == 0) {
            return done('Name is required.');
        }

        //check if passwords match
        if(confirmPassword != password) {
            return done('Passwords must match.'); // 500 error
        }

        new Promise((resolve, reject) => {
            // check if user exists
            Dynamo.User
                .query(email)
                .usingIndex('Email-index')
                .exec((error, data) => {
                    if(error) {
                        console.log(error);
                        reject('There was an error registering.');
                        return;
                    }

                    if(!!data && !!data.Items && data.Items.length > 0) {
                        reject('A user with that email already exists.');
                        return;
                    }

                    resolve();
                });
        })
        .then(() => {
            return new Promise((resolve, reject) => {
                //user does not exist, add user to table
                Dynamo.User
                    .create({
                        UserId: uuid.v4(),
                        isAdmin: false,
                        Email: email,
                        Name: name,
                        Password: bcrypt.hashSync(password),
                        Banned: false
                    }, (error, user) => {
                        if (error) {
                            console.log(error);
                            reject('There was an error registering.');
                            return;
                        }

                        resolve(user);
                    });
            });
        })
        .then(user => done(null, user))
        .catch(message => done(message));
    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for register
    // by default, if there was no name, it would just be called 'local'

    passport.use(new LocalStrategy({
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    (req, email, password, done) => { // callback with email and password from our form
        Dynamo.User
            .query(email)
            .usingIndex('Email-index')
            .exec((error, data) => {
                if(error) {
                    return done('There was an error logging in.');
                }

                if(!data || !data.Items || data.Items.length == 0 || !bcrypt.compareSync(password, data.Items[0].attrs.Password)) {
                    return done('Invalid username or password');
                }

                return done(null, data.Items[0].attrs);
            });
    }));

};
