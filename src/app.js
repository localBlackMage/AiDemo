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
        'aidemo.flock',
        'aidemo.life'
    ]);

    app.controller('HeaderController', ['$rootScope', '$scope', '$state',
        function ($rootScope, $scope, $state) {
            $scope.currentState = $state.current.name;
            $scope.links = [
                {state: 'app', name: 'Home', inactive: false},
                {state: 'app.astar', name: 'A Star', inactive: true},
                {state: 'app.flock', name: 'Flocking', inactive: false},
                {state: 'app.life', name: 'Life', inactive: false}
                //{state: 'app.threejs', name: 'Three JS', inactive: true}
            ];

            $rootScope.$on('$stateChangeStart',
                function (event, toState, toParams, fromState, fromParams) {
                    $scope.currentState = toState.name;
                });
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

