angular.module('MovieTracker')
    .controller('AdminPanelCtrl', function ($http, $location, $scope, $rootScope, toastr) {
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
    });