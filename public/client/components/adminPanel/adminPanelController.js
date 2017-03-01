angular.module('MyApp')
    .controller('AdminPanelCtrl', function ($scope, $rootScope, toastr, AdminPanelService) {
        $scope.user = $rootScope.getUser();
    });