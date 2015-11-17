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
                    food: [],
                    pheromones: [],
                    nest: null,
                    ants: []
                };
                $scope.active = false;
                $scope.cumulativeTime = 0;
                $scope.lastTime = 0;
                $scope.step = 1.0;
                $scope.antStats = {
                    cohesionWeight: 0.25,
                    separateWeight: 0.25,
                    alignWeight: 0.01,
                    avoidWeight: 0.1,
                    pheromoneWeight: 0.25
                };

                $scope.spawnFood = function () {
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
                        }),
                        weights: $scope.antStats,
                        foodStore: 30
                    });
                };

                $scope.instantiate = function () {
                    var foodAmt = Math.round(MathUtils.getRandomNumber(5, 10));
                    for (var idx = 0; idx < foodAmt; idx++) {
                        $scope.environment.food.push($scope.spawnFood());
                    }

                    $scope.environment.nest = $scope.spawnNest();
                    $scope.active = true;
                };

                $scope.clear = function () {
                    $scope.environment = {
                        food: [],
                        pheromones: [],
                        nest: null,
                        ants: []
                    };
                    $scope.active = false;
                };

                $scope.reset = function () {
                    $scope.clear();
                    $scope.instantiate();
                };

                $scope.spawnAnt = function () {
                    var newAnt = $scope.environment.nest.attemptToSpawnAnt();
                    if (newAnt) {
                        $scope.environment.ants.push(newAnt);
                    }
                };

                $scope.addPheromoneToEnvironment = function (pheromone) {
                    if (pheromone) {
                        $scope.environment.pheromones.push(pheromone);
                    }
                };

                $scope.getTouchedFood = function (ant) {
                    var food = MathUtils.getNearestObjects($scope.environment.food, ant, 10);
                    return food.length > 0 ? $scope.environment.food.indexOf(food[0]) : null;
                };

                $scope.antTouchedFood = function(foodIndex) {
                    if (_.isNumber(foodIndex)) {
                        if ($scope.environment.food[foodIndex].takeBite()) {
                            // Remove the food from the environment
                            $scope.environment.food.splice(foodIndex, 1);
                        }
                        return true;
                    }
                    return false;
                };

                $scope.getTouchedNest = function (ant) {
                    var nest = MathUtils.getNearestObjects([$scope.environment.nest], ant, 10);
                    return nest.length > 0 ? nest[0] : null;
                };

                $scope.antTouchedNest = function(nest, ant){
                    if (nest && ant.hasFood) {
                        $scope.environment.nest.addFood();
                        return false;
                    }
                    return true;
                };

                $scope.antTouchedEnvironment = function (ant) {
                    if (!ant.hasFood) {
                        var foodIndex = $scope.getTouchedFood(ant);
                        return $scope.antTouchedFood(foodIndex);
                    }
                    else {
                        var nest = $scope.getTouchedNest(ant);
                        return $scope.antTouchedNest(nest, ant);
                    }
                };

                $scope.updateAnts = function (delta) {
                    var pheromonesToAdd = [];
                    for (var idx in $scope.environment.ants) {
                        $scope.environment.ants[idx].update({
                            box: $scope.box,
                            ants: $scope.environment.ants,
                            food: $scope.environment.food,
                            pheromones: $scope.environment.pheromones,
                            nest: $scope.environment.nest
                        });

                        var pheromone = $scope.environment.ants[idx].attemptToSpawnPheromone(delta);
                        $scope.addPheromoneToEnvironment(pheromone);

                        $scope.environment.ants[idx].hasFood = $scope.antTouchedEnvironment($scope.environment.ants[idx]);
                    }

                    pheromonesToAdd.forEach(function (pheromone) {
                        $scope.spawnPheromone(pheromone);
                    });
                };

                $scope.updatePheromones = function (delta) {
                    var deadPheromones = [];
                    $scope.environment.pheromones.forEach(function (pheromone) {
                        if (pheromone.update(delta)) {
                            deadPheromones.push(pheromone);
                        }
                    });

                    deadPheromones.forEach(function (dead) {
                        $scope.environment.pheromones.splice($scope.environment.pheromones.indexOf(dead), 1);
                    });
                };

                $scope.update = function () {
                    if ($scope.active) {
                        var currTime = new Date().getTime(),
                            delta = (currTime - $scope.lastTime) / 1000;
                        delta = Math.min(delta, 1.0);
                        $scope.cumulativeTime += delta;
                        $scope.lastTime = currTime;

                        if ($scope.cumulativeTime > $scope.step) {
                            $scope.spawnAnt();
                            $scope.cumulativeTime = 0;
                        }

                        $scope.updateAnts(delta);
                        $scope.updatePheromones(delta);
                        $scope.$apply();
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