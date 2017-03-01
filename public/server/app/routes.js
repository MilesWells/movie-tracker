const Dynamo = require('../config/dynamoDB');
const uuid = require('uuid');

module.exports = function(app, passport) {
	// index route
	app.get('/', (req, res) => {
		res.render('index.ejs');
	});

	// login route
	app.post('/login', passport.authenticate('local'), (req, res) => {
		res.send(req.user);
	});

	// route to test if the user is logged in or not
	app.get('/loggedin', function(req, res) {
		res.send(req.isAuthenticated() ? req.user : '0');
	});

    // route to test if the user is an admin
    app.get('/isadmin', function(req, res) {
        res.send((req.isAuthenticated() && req.user.attrs.isAdmin) ? req.user : '0');
    });

	// register route
	app.post('/register', passport.authenticate('local-register'), (req, res) => {
		res.send(req.user);
	});

	// update user info
	app.put('/me', isAuthenticated, (req, res) => {
		Dynamo.User
			.update(req.body.user, (error, user) => {
				if(error) {
					res.status(500).send(error);
				} else {
					res.send(user);
				}
			});
	});

	// logout route
	app.post('/logout', (req, res) => {
		req.logout();
		req.session.destroy( err => {
            if (err) { return next(err); }
            res.send(200);
        });
	});

    function isAuthenticated(req, res, next) {

        // do any checks you want to in here

        // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
        // you can do this however you want with whatever variables you set up
        if(req.isAuthenticated()) {
            return next();
        }

        // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
        res.status(401).send('Unauthorized');
    }

    function hasAdminAccess(req, res, next) {
    	if(req.isAuthenticated() && req.user.attrs.isAdmin) {
    		return next();
		}

		res.status(401).send('Unauthorized');
	}
};