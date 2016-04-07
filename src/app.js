(function (ng) {
    'use strict';

    var app = ng.module('aidemo.app', [
        // Other dependencies
        'ui.router',

        // Templates
        'aidemo.templates',

        // Directives
        'aidemo.ui.canvas',

        // Controllers
        'aidemo.flock',
        'aidemo.ant',
        'aidemo.life',
        'aidemo.astar',
        'aidemo.chip'
    ]);

    app.controller('HeaderController', ['$rootScope', '$scope', '$state',
        function ($rootScope, $scope, $state) {
            $scope.currentState = $state.current.name;
            $scope.links = [
                {state: 'app', name: 'Home', inactive: false},
                {state: 'app.life', name: 'Life', inactive: false},
                {state: 'app.flock', name: 'Flocking', inactive: false},
                {state: 'app.ant', name: 'Ants', inactive: false},
                {state: 'app.astar', name: 'A Star', inactive: false},
                {state: 'app.chip', name: 'Chip\'s Challenge', inactive: true}
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

