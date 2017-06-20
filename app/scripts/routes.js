(function() {
    'use strict';

    /**
     * Gestion des routes de l'application.
     */
    angular.module('hello').config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
            .when('/', {
                templateUrl: '/views/accueil.html'
            })
            .when('/hello/summary', {
                templateUrl: '/views/accueil.html'
            })
            .otherwise({
                redirectTo: '/'
            });
        }
    ]);
})();