angular.module('MyApp')
    .controller('ProfileCtrl', function ($scope, $rootScope, $http, toastr) {
        $scope.user = $rootScope.getUser();
    });