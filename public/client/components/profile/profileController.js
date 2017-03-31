angular.module('MovieTracker')
    .controller('ProfileCtrl', function ($scope, $rootScope, $http, toastr) {
        $scope.user = $rootScope.getUser();
    });