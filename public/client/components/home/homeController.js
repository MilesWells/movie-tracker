angular.module('MyApp')
    .controller('HomeCtrl', function ($scope, $rootScope, $location, $http) {
        $scope.user = $rootScope.getUser();

        $scope.$watch(
            () => $rootScope.user,
            () => {
                $scope.user = $rootScope.user;
            }, true);

        $rootScope.$on('$locationChangeSuccess', () => {
            $scope.showNavBar = $location.path().trim() !== '/';
        });

        $scope.logout = function() {
            $http.post('/logout', {})
                .success(() => {
                    $rootScope.setUser(null);

                    $location.url('/');
                });
        };
    });