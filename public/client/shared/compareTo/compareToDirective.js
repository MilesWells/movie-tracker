angular.module('MovieTracker')
    .directive('compareTo', () => {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: (scope, element, attributes, ngModel) => {

                ngModel.$validators.compareTo = function(modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", () => {
                    ngModel.$validate();
                });
            }
        };
    });