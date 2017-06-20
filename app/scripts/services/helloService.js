(function() {
    'use strict';
    angular.module('hello').service('HelloService', ['$http', '$window', 'Utils', 'API', HelloService]);
    var services = {};

    function HelloService($http, $window, Utils, API) {
        services = {
            /** 
             *
             */
            projects: function(successCallback, errorCallback) {
                var authentication_key = 'ec8921cc4918dfed9c81aef782c739eff27aa70d';
                var authentication_param = 'key='+authentication_key;

                return $http.get(API.redmine.projects())
                    .success(function(data, status, headers, config) {
                        if (!Utils.empty(successCallback)) {
                            successCallback(data, status, headers, config);
                        }
                    }).error(function(data, status, headers, config) {
                        if (!Utils.empty(errorCallback)) {
                            errorCallback(data, status, headers, config);
                        }
                    });
            }
        };
        return services;
    }
})();