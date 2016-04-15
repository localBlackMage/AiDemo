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

    app.controller('HeaderController', ['$rootScope', '$state', '$window',
        function ($rootScope, $state, $window) {
            var vm = this;
            vm.currentState = $state.current.name;
            vm.homeLink = {state: 'app', name: 'Home', inactive: false};
            vm.links = [
                {state: 'app.life', name: 'Life', inactive: false},
                {state: 'app.flock', name: 'Swarming', inactive: false},
                {state: 'app.ant', name: 'Ants', inactive: false},
                {state: 'app.astar', name: 'A Star', inactive: false},
                {state: 'app.chip', name: 'Chip\'s Challenge', inactive: true}
                //{state: 'app.threejs', name: 'Three JS', inactive: true}
            ];

            $rootScope.$on('$stateChangeStart',
                function (event, toState, toParams, fromState, fromParams) {
                    vm.currentState = toState.name;
                });

            vm.goToBlog = function() {
                $window.location.href = "http://acrylicorner.com/";
            };
        }
    ]);

    app.controller('DashboardController', ['$scope', '$state',
        function ($scope, $state) {
        }
    ]);

    app.config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.when('', '/');

            $stateProvider
                .state('app', {
                    url: '/',
                    views: {
                        'header@': {
                            templateUrl: 'header.html',
                            controller: 'HeaderController',
                            controllerAs: 'headCtrl'
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

