'use strict';
describe("RedmineService", function() {

    beforeEach(module("taskboard"));

    var service, $httpBackend, Utils, API;//, $resource;
    beforeEach(inject(function (RedmineService, _$httpBackend_, _Utils_,  _API_) {
        service = RedmineService;
        $httpBackend = _$httpBackend_;
        Utils = _Utils_;
        API = _API_;
        
        // var $injector = angular.injector(['ng', 'ngResource']);
        // $resource = $injector.get('$resource');
    }));
    
    
    describe("redmine rest api", function() {

        it("should get projects", function() {
            // Normalement, on doit pouvoir récupérer les mocks json comme suit avec un plugin karma
//        $httpBackend.whenGET(API.redmine.projects()).respond(
//            $resource("/test/unit/mocks/catalogue.json").get()
//        );
            // HACK pour externaliser les jsons
            $httpBackend.whenGET(API.redmine.projects()).respond(fakeProjects);
            var promise = service.projects(function(data, status, headers, config) {
                expect(data).toBeDefined();
                expect(data.projects.length).toEqual(17);
            }, function(data, status, headers, config) {
                // TODO mark test as failed in callback return
                console.log('ERRRROOOOOORRRR');
            });
            $httpBackend.expectGET(API.redmine.projects());
            $httpBackend.flush(); // pour rendre la requete synchrone (sinon exécute la suite du test alors que la requête n'est pas terminée)
        });

        it("should get versions", function() {
            $httpBackend.whenGET(API.redmine.versions()).respond(fakeVersions);
            var promise = service.versions(function(data, status, headers, config) {
                expect(data).toBeDefined();
                expect(data.versions.length).toEqual(8);
            }, function(data, status, headers, config) {
                // TODO mark test as failed in callback return
                console.log('ERRRROOOOOORRRR');
            });
            $httpBackend.expectGET(API.redmine.versions());
            $httpBackend.flush(); // pour rendre la requete synchrone (sinon exécute la suite du test alors que la requête n'est pas terminée)
        });

        it("should get issues", function() {
            $httpBackend.whenGET(API.redmine.issues()).respond(fakeIssues);
            var promise = service.issues(function(data, status, headers, config) {
                expect(data).toBeDefined();
                expect(data.issues.length).toEqual(11);
            }, function(data, status, headers, config) {
                // TODO mark test as failed in callback return
                console.log('ERRRROOOOOORRRR');
            });
            $httpBackend.flush(); // pour rendre la requete synchrone (sinon exécute la suite du test alors que la requête n'est pas terminée)
        });

        it("should udpate issue", function() {
            $httpBackend.whenPUT(API.redmine.issue_update()).respond(fakeUpdate);
            var promise = service.updateIssue(function(data, status, headers, config) {
                expect(data).toBe(true);
            }, function(data, status, headers, config) {
                // TODO mark test as failed in callback return
                console.log('ERRRROOOOOORRRR');
            });
            $httpBackend.flush(); // pour rendre la requete synchrone (sinon exécute la suite du test alors que la requête n'est pas terminée)
        });

        it("should get memberships", function() {
            $httpBackend.whenGET(API.redmine.memberships()).respond(fakeMemberships);
            var promise = service.memberships(function(data, status, headers, config) {
                expect(data).toBeDefined();
                expect(data.memberships.length).toEqual(18);
            }, function(data, status, headers, config) {
                // TODO mark test as failed in callback return
                console.log('ERRRROOOOOORRRR');
            });
            $httpBackend.flush(); // pour rendre la requete synchrone (sinon exécute la suite du test alors que la requête n'est pas terminée)
        });
    });
});