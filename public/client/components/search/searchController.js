angular.module('MovieTracker')
    .controller('SearchCtrl', function ($scope, $rootScope, $http, $location, toastr, MyMoviesService) {
        $scope.user = $rootScope.getUser();

        if(!$scope.user) {
            $location.url('/login');
            return;
        }

        $http.get('/loggedin', {})
            .then(result => {
                if (!result || !result.data || !result.data.UserId) {
                    $location.url('/login');
                }
            });

        $scope.sortOptions = [
            { name: 'Title (A - Z)', key: 'Title', reverse: false },
            { name: 'Title (Z - A)', key: 'Title', reverse: true },
            { name: 'IMDB Rating (Best First)', key: 'ImdbRating', reverse: true },
            { name: 'IMDB Rating (Worst First)', key: 'ImdbRating', reverse: false },
            { name: 'Year (Newest First)', key: 'Year', reverse: true },
            { name: 'Year (Oldest First)', key: 'Year', reverse: false },
            { name: 'Runtime (Shortest First)', key: 'Runtime', reverse: false },
            { name: 'Runtime (Longest First)', key: 'Runtime', reverse: true }
        ];

        $scope.selectedSortOption = $scope.sortOptions[0];

        $scope.search = function() {
            $scope.hasActiveRequest = true;

            $http.post('/movies', { movies: $scope.movieSearchList })
                .then((result) => {
                    $scope.movies = result.data.found;
                    let notFound = result.data.notFound.filter((error) => error.name && error.name === 'imdb api error');
                    let errors = result.data.notFound.filter((error) => !error.name || error.name !== 'imdb api error');

                    $scope.notFound = notFound.length > 0 ? notFound : null;
                    $scope.errors = errors.length > 0 ? errors : null;

                    $scope.movies = $scope.movies.map((movie) => MyMoviesService.mapFromImdb(movie));
                }).catch((error) => {
                    toastr.error(error);
                }).finally(() => $scope.hasActiveRequest = false);
        };

        $scope.addMovie = function(movie) {
            MyMoviesService.addMovie(movie, $scope.user.UserId)
                .then((result) => {
                    if(result !== null) {
                        movie.MovieId = result.data.MovieId;
                    }
                })
        };

        $scope.removeMovie = function(movieData) {
            MyMoviesService.deleteMovie(movieData.MovieId, $scope.user.UserId)
                .then((result) => {
                    if(result === null) {
                        movieData.MovieId = undefined;
                        movieData.Seen = false;
                        movieData.UserRating = '';
                    }
                })
        }
    });