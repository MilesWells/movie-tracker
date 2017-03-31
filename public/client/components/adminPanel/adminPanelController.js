angular.module('MovieTracker')
    .controller('AdminPanelCtrl', function ($scope, $rootScope, toastr, AdminPanelService) {
        $scope.user = $rootScope.getUser();
    });