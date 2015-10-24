(function (ng) {
    'use strict';

    var app = ng.module('aidemo.app', [
        // Other dependencies
        'ui.router',
        //'ngSanitize',
        //'ui.bootstrap',
        //'ngAnimate',

        // Templates
        'aidemo.templates',

        // Services
        'aidemo.services.aStar',

        // Directives
        'aidemo.ui.canvas',

        // Controllers
        'aidemo.flock'
    ]);

    app.controller('HeaderController', ['$scope', '$state',
        function ($scope, $state) {
            $scope.links = [
                {state: 'app', name: 'Home', inactive: false},
                {state: 'app.astar', name: 'A Star', inactive: true},
                {state: 'app.flock', name: 'Flocking', inactive: false},
                {state: 'app.life', name: 'Life', inactive: true},
                {state: 'app.threejs', name: 'Three JS', inactive: true}
            ];
        }
    ]);

    app.controller('DashboardController', ['$scope', '$state',
        function ($scope, $state) {
        }
    ]);

    app.config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

            //$urlRouterProvider.when('/', '/dashboard');
            $urlRouterProvider.when('', '/');

            $stateProvider
                .state('app', {
                    url: '/',
                    views: {
                        'header@': {
                            templateUrl: 'header.html',
                            controller: 'HeaderController'
                        },
                        'main@': {
                            templateUrl: 'dashboard.html',
                            controller: 'DashboardController'
                        }
                    }
                });
        }
    ]);
})(angular);

