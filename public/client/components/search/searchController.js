angular.module('MovieTracker')
    .controller('SearchCtrl', function ($scope, $rootScope, $http, toastr) {
        $scope.user = $rootScope.getUser();

        $scope.sortOptions = [
            { name: 'Title (A - Z)', key: 'title', reverse: false },
            { name: 'Title (Z - A)', key: 'title', reverse: true },
            { name: 'IMDB Rating (Best First)', key: 'rating', reverse: true },
            { name: 'IMDB Rating (Worst First)', key: 'rating', reverse: false },
            { name: 'Year (Newest First)', key: 'year', reverse: true },
            { name: 'Year (Oldest First)', key: 'year', reverse: false },
            { name: 'Runtime (Shortest First)', key: 'runtimeInt', reverse: false },
            { name: 'Runtime (Longest First)', key: 'runtimeInt', reverse: true },
        ];

        $scope.selectedSortOption = $scope.sortOptions[0];

        $scope.search = function() {
            $scope.hasActiveRequest = true;

            $http.post('/movies', { movies: $scope.movieSearchList })
                .then((result) => {
                    console.log(result);
                    $scope.movies = result.data.found;
                    $scope.errors = result.data.notFound;
                }).catch((error) => {
                    toastr.error(error);
                }).finally(() => $scope.hasActiveRequest = false);
        };
    });