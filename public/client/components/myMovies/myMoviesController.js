angular.module('MovieTracker')
    .controller('MyMoviesCtrl', function ($scope, $rootScope, $http, $location, toastr, MyMoviesService) {
        $scope.user = $rootScope.getUser();

        $scope.sortOptions = [
            { name: 'Title (A - Z)', key: 'Title', reverse: false },
            { name: 'Title (Z - A)', key: 'Title', reverse: true },
            { name: 'My Rating (Best First)', key: 'UserRating', reverse: true },
            { name: 'My Rating (Worst First)', key: 'UserRating', reverse: false },
            { name: 'IMDB Rating (Best First)', key: 'ImdbRating', reverse: true },
            { name: 'IMDB Rating (Worst First)', key: 'ImdbRating', reverse: false },
            { name: 'Year (Newest First)', key: 'Year', reverse: true },
            { name: 'Year (Oldest First)', key: 'Year', reverse: false },
            { name: 'Runtime (Shortest First)', key: 'Runtime', reverse: false },
            { name: 'Runtime (Longest First)', key: 'Runtime', reverse: true }
        ];

        $scope.showOptions = [
            { name: 'All', value: 'all' },
            { name: 'Seen', value: true },
            { name: 'Not Seen', value: false }
        ];

        $scope.selectedSortOption = $scope.sortOptions[0];
        $scope.selectedShowOption = $scope.showOptions[0];

        $scope.updateRating = function(movie) {
            if(movie.UserRating !== '') {
                movie.Seen = true;
            }

            MyMoviesService.updateMovie(movie, $scope.user.UserId);
        };

        $scope.updateSeen = function(movie) {
            if(movie.Seen === false) {
                movie.UserRating = '';
            }

            MyMoviesService.updateMovie(movie, $scope.user.UserId);
        };

        $scope.removeMovie = function(movieData) {
            MyMoviesService.deleteMovie(movieData.MovieId, $scope.user.UserId)
                .then(() => $scope.movies.splice($scope.movies.indexOf(movieData), 1));
        };

        $scope.$init = function() {
            MyMoviesService.getMovies($scope.user.UserId)
                .then((result) => {
                    const movies = result.data.Items.map((movie) => MyMoviesService.mapFromImdb(movie));

                    $scope.movies = movies.length == 0 ? null : movies;
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