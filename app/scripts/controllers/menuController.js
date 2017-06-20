(function() {
    'use strict';
    angular.module('hello').controller('MenuController', ['$scope', '$location', '$route', 'Utils', 'HelloService',
        function($scope, $location, $route, Utils, HelloService) {
            $scope.utils = Utils;

            var init = function() {

                HelloService.initMenu(function(data, status, headers, config) {

                    jQuery(".button-collapse, .btn-collapse").sideNav({
                        menuWidth: 450
                    });
                    jQuery(".dropdown-button").dropdown({
                        hover: false
                    });
                    jQuery(".dropdown-button.project").dropdown({
                        hover: false
                    });
                }, function(data, status, headers, config) {
                    // console.log(data);
                    Materialize.toast("Erreur lors de la récupération des projets", 3000);
                });
                
                jQuery('.tooltipped').tooltip({delay: 50});
                
            };

            $scope.loadVersions = function(project) {
                $scope.issuesLoaded = false;
                $scope.current.project = project;

                $scope.versions = [];
                $scope.projectsButtonLabel = project.name;
                $scope.versionsButtonLabel = 'Choose a sprint';
                $location.path('projects/' + project.id);
                
                HelloService.versions(function(data, status, headers, config) {
                    // console.log('versions', data);
                    $scope.versions = data.versions;
                    
                    jQuery(".dropdown-button.version").dropdown({
                        hover: false
                    });
                    jQuery(".dropdown-button.version").show();

                }, function(data, status, headers, config) {
                    // console.log(data);
                    Materialize.toast("Erreur lors de la récupération des versions du projet", 3000);
                }, project.id);

            };

            $scope.loadIssues = function(version) {
                $scope.issuesLoaded = true;
                $scope.current.version = version;

                $scope.versionsButtonLabel = version.name;
                $location.path(SettingsService.data.taskboard+ '/' + version.project.id + '/' + version.id);
            };

            $scope.loadBugs = function() {
                $scope.issuesLoaded = true;
                $location.path('bugs/' + $scope.current.project.id);
            };

            init();
            
        }
    ]);
})();