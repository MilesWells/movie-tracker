angular.module('MovieTracker')
    .controller('RegisterCtrl', function ($scope, $rootScope, $http, $location) {
        $scope.message = '';

        $http.get('/loggedin', {})
            .then(result => {
                if (result.data.UserId) {
                    $location.url('/profile');
                }
            });

        // Register the login() function
        $scope.register = function(isValid) {
            if(!isValid) {
                return;
            }

            $scope.hasActiveRequest = true;

            $http.post('/register', {
                username: $scope.email,
                password: $scope.password,
                confirmPassword: $scope.confirmPassword,
                name: $scope.name
            })
            .then(user => {
                $rootScope.setUser(user.data);

                // No error: authentication OK
                $location.url('/profile');
            })
            .catch(response => {
                // Error: authentication failed
                $scope.message = response;
                $scope.hasActiveRequest = false;
            });
        };
    });