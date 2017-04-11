angular.module('MovieTracker')
    .controller('ProfileCtrl', function ($scope, $rootScope, $http, $location, toastr, MyMoviesService) {
        $scope.user = $rootScope.getUser();

        function chunk(arr, size) {
            let newArr = [];
            for (let i=0; i<arr.length; i+=size) {
                newArr.push(arr.slice(i, i+size));
            }
            return newArr;
        }

        $scope.$init = function() {
            MyMoviesService.getMovies($scope.user.UserId)
                .then((result) => {
                    const movies = result.data.Items.map((movie) => MyMoviesService.mapFromImdb(movie));

                    $scope.movies = movies.length == 0 ? null : movies;

                    // build stats
                    if($scope.movies && $scope.movies.length > 0) {
                        // total number of movies
                        const numMovies = $scope.movies.length;
                        let stats = [{ name: 'Total movies in list', value: numMovies }];

                        // total seen
                        const numSeen = $scope.movies.filter((movie) => movie.Seen).length;
                        stats.push({ name: 'Total movies seen', value: `${numSeen} (${(numSeen/numMovies*100).toFixed(2)}%)` });

                        // total runtime
                        const minutes = $scope.movies.reduce((total, movie) => {
                            const runTime = movie.Runtime.match(/\d+/g);
                            if(runTime && runTime.length > 0) {
                                return total + parseInt(runTime[0]);
                            }

                            return total;
                        }, 0);
                        stats.push({ name: 'Total runtime of movies', value: `${Math.floor(minutes/60)} hour(s) and ${minutes % 60} minute(s)` });

                        // average runtime
                        const avgMinutes = Math.round(minutes / numMovies);
                        stats.push({ name: 'Average runtime', value: `${Math.floor(avgMinutes/60)} hour(s) and ${avgMinutes % 60} minute(s)` });

                        // average user rating
                        const ratings = $scope.movies.reduce((obj, movie) => {
                            if(movie.UserRating) {
                                obj.numRated++;
                                obj.totalRating += movie.UserRating;
                            }

                            return obj;
                        }, { numRated: 0, totalRating: 0});
                        stats.push({ name: 'Average rating you\'ve given', value: (ratings.totalRating / ratings.numRated).toFixed(1) });

                        // average imdb rating
                        const imdbRatings = $scope.movies.reduce((obj, movie) => {
                            if(movie.ImdbRating) {
                                obj.numRated++;
                                obj.totalRating += movie.ImdbRating;
                            }

                            return obj;
                        }, { numRated: 0, totalRating: 0});
                        stats.push({ name: 'Average IMDb rating', value: (imdbRatings.totalRating / imdbRatings.numRated).toFixed(1) });

                        // genre breakdown
                        $scope.genres = [];
                        $scope.movies.forEach((movie) => {
                            movie.Genres.split(', ').forEach((genre) => {
                                if(!$scope.genres[genre]) {
                                    $scope.genres[genre] = 1;
                                } else {
                                    $scope.genres[genre]++;
                                }
                            });
                        });
                        
                        $scope.chunkedStats = chunk(stats, 2);
                    }
                }).catch((error) => {
                    console.log(error);
                });
        };

        if(!$scope.user) {
            $location.url('/login');
            return;
        }

        $http.get('/loggedin', {})
            .then(result => {
                if (!result || !result.data || !result.data.UserId) {
                    $location.url('/login');
                } else {
                    $scope.$init();
                }
            });
    });