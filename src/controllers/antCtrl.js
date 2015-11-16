(function (ng) {
    'use strict';

    ng.module('aidemo.ant', [
        'ui.router',
        'aidemo.service.mathUtils',
        'aidemo.service.drawUtils',
        'aidemo.models.vector',
        'aidemo.models.ant'
    ])
        .controller("AntController", ['$scope', 'MathUtils', 'DrawUtils', 'Vector', 'Nest', 'Ant', 'Food',
            function ($scope, MathUtils, DrawUtils, Vector, Nest, Ant, Food) {
                $scope.box = {};
                $scope.BACK_COLOR = "#555555";
                $scope.GRID_COLOR = "#8EAEC9";
                $scope.environment = {
                    ants: [],
                    food: [],
                    pheromones: [],
                    nest: null
                };
                $scope.cumulativeTime = 0;
                $scope.lastTime = 0;
                $scope.step = 1.0;

                $scope.spawnFood = function() {
                    return new Food({
                        position: new Vector({
                            x: MathUtils.getRandomNumber(10.0, $scope.box.width - 10),
                            y: MathUtils.getRandomNumber(10.0, $scope.box.height - 10)
                        })
                    });
                };

                $scope.spawnNest = function () {
                    return new Nest({
                        position: new Vector({
                            x: MathUtils.getRandomNumber(10.0, $scope.box.width - 10),
                            y: MathUtils.getRandomNumber(10.0, $scope.box.height - 10)
                        })
                    });
                };

                $scope.instantiate = function () {
                    var foodAmt = Math.round(MathUtils.getRandomNumber(5, 10));
                    for(var idx=0; idx<foodAmt;idx++){
                        $scope.environment.food.push($scope.spawnFood());
                    }

                    $scope.environment.nest = $scope.spawnNest();
                };
                
                $scope.clear = function() {
                    $scope.environment = {
                        ants: [],
                        food: [],
                        pheromones: [],
                        nest: null
                    };
                };
                
                $scope.reset = function() {
                    $scope.clear();
                    $scope.instantiate();
                };

                $scope.update = function () {
                    var currTime = new Date().getTime();
                    $scope.cumulativeTime += (currTime - $scope.lastTime) / 1000;
                    $scope.lastTime = currTime;

                    if ($scope.cumulativeTime > $scope.step) {
                        // TODO: Make pheromones
                        // TODO: Make ants
                        $scope.cumulativeTime = 0;
                    }
                };
            }
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                .state('app.ant', {
                    url: 'ant',

                    resolve: {},

                    views: {
                        'main@': {
                            templateUrl: 'antDemo.html',
                            controller: 'AntController'
                        }
                    }
                });
        }]);
}(angular));