(function() {
    'use strict';
    angular.module('hello').directive('XXX', function() {
        return {
            restrict: 'E',
            controller: 'XXXController',
            templateUrl: 'views/fragments/fragment.html'
        };
    });
})();