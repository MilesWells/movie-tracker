angular.module('MyApp').factory('CommonService', () => {

        return {
            allFalse: allFalse
        };

        function allFalse(object) {
            for (let i in object) {
                if (object[i] === true) {
                    return false;
                }
            }

            return true;
        }

    }
);