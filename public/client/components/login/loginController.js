angular.module('MovieTracker')
    .controller('LoginCtrl', function ($scope, $rootScope, $http, $location) {
        $scope.message = '';

        $http.get('/loggedin', {})
            .then(result => {
                if (result.data.UserId) {
                    $location.url('/profile');
                }
            });

        // Register the login() function
        $scope.login = function() {
            $scope.hasActiveRequest = true;

            $http.post('/login', {
                username: $scope.email,
                password: $scope.password
            })
            .then(user => {
                $rootScope.setUser(user.data);
                // No error: authentication OK
                $location.url('/profile');
            })
            .catch(() => {
                // Error: authentication failed
                $scope.message = 'Incorrect username or password.';
                $scope.hasActiveRequest = false;
            });
        };
    });