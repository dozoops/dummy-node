(function() {
    'use strict';
    angular.module('hello').controller('HelloController', ['$scope', '$location', '$routeParams', '$window', 'HelloService', 'Utils',
        function($scope, $location, $routeParams, $window, HelloService, Utils) {
            // console.log('TaskboardController');

            $scope.Utils = Utils;

            var navHeight = jQuery('nav').height();
            // FIXME usHeight calculée trop tot !!! donc tjrs égale à 0. Il faut trouver où mettre le bout de code...
            var usHeight = jQuery('#fwk').height();
            angular.element($window).bind('scroll', function() {
            	var scrolling;
            	if (jQuery(this).scrollTop() > (navHeight+usHeight)) {
		            scrolling = true;
		        } else {
		            scrolling = false;
		        }

		        // le $digest étant très consommateur, on le fait uniquement au changement d'état
		        if(scrolling !== $scope.scrolling) {
		        	$scope.scrolling = scrolling;
					$scope.$digest(); // notifie la view que le $scope a été modifié
		        }
		    });
            
		    angular.element(document).ready(function() {
            	jQuery('select').material_select();
		    });


            var init = function() {
            	HelloService.start()
			};
			
            init();
        }
    ]);
})();