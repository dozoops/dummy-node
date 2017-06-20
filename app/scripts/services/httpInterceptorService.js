(function() {
    "use strict";
    angular.module('hello').service('HttpInterceptorService', ['$q', '$rootScope', 'mockMode',
        function($q, $rootScope, mockMode) {
            
            this.request = function(config) {
                                
                // En mode bouchonné, permet de forcer les request en get pour récupérer les fichiers json (mock)
                if(mockMode) {
                    config.method = 'GET';
                }
                
                //$rootScope.$broadcast('loaderShow');
                return config || $q.when(config);
            };
            this.response = function(response) {
                return response || $q.when(response);
            };
            this.responseError = function(response) {
                return $q.reject(response);
            };

            return this;
        }
    ]);
})();