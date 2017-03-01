angular.module('MyApp')
    .controller('RegisterCtrl', function ($scope, $rootScope, $http, $location) {
        $scope.message = '';

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
            .success(user => {
                $rootScope.setUser(user);

                // No error: authentication OK
                $location.url('/profile');
            })
            .error(response => {
                // Error: authentication failed
                $scope.message = response;
                $scope.hasActiveRequest = false;
            });
        };
    });