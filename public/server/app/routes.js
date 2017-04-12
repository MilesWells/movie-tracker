const Dynamo = require('../config/dynamoDB');
const uuid = require('uuid');
const imdbApi = require('imdb-api');

module.exports = function(app, passport) {
	app.all('*', (req, res, next) => {
        if (req.get('x-forwarded-proto') == 'https') {
            return next();
        }

        res.set('x-forwarded-proto', 'https');
        res.redirect(`https://${req.host}${req.url}`);
	});

	// index route
	app.get('/', (req, res) => {
		res.render('index.ejs');
	});

	// login route
	app.post('/login', passport.authenticate('local'), (req, res) => {
		res.send(req.user);
	});

	// route to test if the user is logged in or not
	app.get('/loggedin', (req, res) => {
		res.send(req.isAuthenticated() ? req.user : '0');
	});

    // route to test if the user is an admin
    app.get('/isadmin', (req, res) => {
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

	app.post('/movies', isAuthenticated, (req, res) => {
        let movies = req.body.movies.split(/\r?\n/);
        let promises = [];

        let result = {
            found: [],
            notFound: []
        };

        if(req.body.movies.length == 0 || movies.length == 0) {
        	res.send(result);
		}

        Dynamo.Movie
            .scan()
            .where('UserId').equals(req.user.attrs.UserId)
            .where('Title').in(movies)
            .exec((error, data) => {
                if (!error && data) {
                    data.Items.forEach((movieData) => result.found.push(movieData.attrs));
                    movies = movies.filter((movie) => {
                    	for(let i = 0; i < result.found.length; i++) {
                    		if(movie == result.found[i].Title) return false;
						}

						return true;
					});
                }

                movies.forEach((value) => {
                    promises.push(imdbApi.getReq({name: value}).catch((err) => err));
                });

                Promise.all(promises).then((values) => {
                    values.forEach((imdbResult) => {
                        if (imdbResult.constructor.name !== 'ImdbError') {
                            imdbResult.runtimeInt = parseInt(imdbResult.runtime.split(' ')[0]);
                            result.found.push(imdbResult);
                        } else {
                            result.notFound.push(imdbResult);
                        }
                    });

                    res.send(result);
                }).catch((error) => {
                	console.log(error);
                	res.send('Failed to complete search');
				});

            });
    });

	app
		.post('/movies/:userId', isAuthenticated, (req, res) => {
			let movie = req.body.movie;
			movie.MovieId = uuid.v4();
			movie.UserId = req.params.userId;

			Dynamo.Movie
				.create(movie, (error, movie) => {
					if(error) {
						console.log(error);
						res.status(500).send(error);
					} else {
						res.send(movie);
					}
				});
		})
		.put('/movies/:userId/:movieId', isAuthenticated, (req, res) => {
			if(req.params.movieId != req.body.movie.MovieId || req.params.userId != req.body.movie.UserId) {
				res.status(400).send('Ids in body must match those in URL.');
				return;
			}

			let movie = req.body.movie;

			Dynamo.Movie
				.update(movie, (error, movie) => {
					if(error) {
						console.log(error);
						res.status(500).send(error);
					} else {
						res.send(movie);
					}
				});
		})
		.get('/movies/:userId', isAuthenticated, (req, res) => {
            Dynamo.Movie
                .query(req.params.userId)
                .usingIndex('UserId-index')
                .exec((error, data) => {
                    if (error) {
                        console.log(error);
                        res.status(500).send(error);
                    } else {
                        res.send(data);
                    }
                });
		})
		.delete('/movies/:userId/:movieId', isAuthenticated, (req, res) => {
            Dynamo.Movie
                .destroy(req.params.movieId, (error) => {
                    if(error) {
                        res.status(500).send(error);
                    } else {
                        res.send('Movie delete from your list!');
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