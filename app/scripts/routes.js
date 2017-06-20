(function() {
    'use strict';

    /**
     * Gestion des routes de l'application.
     */
    angular.module('dummy').config(['$routeProvider',
        function($routeProvider) {
            $routeProvider
            .when('/', {
                templateUrl: '/views/accueil.html'
            })
            .when('/dummy/summary', {
                templateUrl: '/views/accueil.html'
            })
            .otherwise({
                redirectTo: '/'
            });
        }
    ]);
})();