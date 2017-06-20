(function() {
    'use strict';
    // chargement de langue FR
    moment().locale('fr');

    // injection des plugins
    angular.module('dummy', ['ngRoute', 'config', 'ngAnimate']); //['angular-growl','ngRoute', 'ui.bootstrap', 'ngAnimate', 'fundoo.services', 'ngTouch']);

    document.addEventListener("backbutton", onBackKeyDown, false);
    function onBackKeyDown(e) {
        e.preventDefault();
    }
    //Gestion de l'interception des requetes http
    angular.module('dummy').config(['$httpProvider',
        function($httpProvider) {
            $httpProvider.defaults.headers.common.Accept = 'application/json';
            $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=UTF-8';
            $httpProvider.interceptors.push('HttpInterceptorService');
        }
    ]);
})();