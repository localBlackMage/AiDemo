(function (ng) {
    'use strict';

    ng.module('aidemo.ant', [
        'ui.router',
        'aidemo.service.mathUtils',
        'aidemo.service.drawUtils',
        'aidemo.models.vector',
        'aidemo.models.ants.ant',
        'aidemo.models.ants.food',
        'aidemo.models.ants.nest'
    ])
        .controller("AntController", ['$scope', 'MathUtils', 'DrawUtils', 'Vector', 'Nest', 'Ant', 'Food',
            function ($scope, MathUtils, DrawUtils, Vector, Nest, Ant, Food) {
                var vm = this;
                vm.box = {};
                vm.BACK_COLOR = "#555555";
                vm.GRID_COLOR = "#8EAEC9";
                vm.environment = {
                    food: [],
                    pheromones: [],
                    nest: null,
                    ants: []
                };
                vm.active = false;
                vm.lastTime = 0;
                vm.antStats = {
                    cohesionWeight: 0.25,
                    separateWeight: 0.25,
                    alignWeight: 0.01,
                    avoidWeight: 0.1,
                    pheromoneWeight: 0.25
                };

                vm.spawnFood = function () {
                    return new Food({
                        position: new Vector({
                            x: MathUtils.getRandomNumber(10.0, vm.box.width - 10),
                            y: MathUtils.getRandomNumber(10.0, vm.box.height - 10)
                        })
                    });
                };

                vm.spawnNest = function () {
                    return new Nest({
                        position: new Vector({
                            x: MathUtils.getRandomNumber(10.0, vm.box.width - 10),
                            y: MathUtils.getRandomNumber(10.0, vm.box.height - 10)
                        }),
                        weights: vm.antStats,
                        foodStore: 30
                    });
                };

                vm.createEnvironment = function () {
                    var foodAmt = Math.round(MathUtils.getRandomNumber(5, 10));
                    for (var idx = 0; idx < foodAmt; idx++) {
                        vm.environment.food.push(vm.spawnFood());
                    }

                    vm.environment.nest = vm.spawnNest();
                    vm.active = true;
                };

                vm.clear = function () {
                    vm.environment = {
                        food: [],
                        pheromones: [],
                        nest: null,
                        ants: []
                    };
                    vm.active = false;
                };

                vm.reset = function () {
                    vm.clear();
                    vm.createEnvironment();
                };

                vm.spawnAnt = function (delta) {
                    var newAnt = vm.environment.nest.updateTimeAndAttemptToSpawnAnt(delta);
                    if (newAnt) {
                        vm.environment.ants.push(newAnt);
                    }
                };

                vm.addPheromoneToEnvironment = function (pheromone) {
                    if (pheromone) {
                        vm.environment.pheromones.push(pheromone);
                    }
                };

                vm.getTouchedFood = function (ant) {
                    var food = MathUtils.getNearestObjects(vm.environment.food, ant, 10);
                    return food.length > 0 ? vm.environment.food.indexOf(food[0]) : null;
                };

                vm.antTouchedFood = function (foodIndex) {
                    if (_.isNumber(foodIndex)) {
                        if (vm.environment.food[foodIndex].takeBite()) {
                            // Remove the food from the environment
                            vm.environment.food.splice(foodIndex, 1);
                        }
                        return true;
                    }
                    return false;
                };

                vm.getTouchedNest = function (ant) {
                    var nest = MathUtils.getNearestObjects([vm.environment.nest], ant, 10);
                    return nest.length > 0 ? nest[0] : null;
                };

                vm.antTouchedNest = function (nest, ant) {
                    if (nest && ant.hasFood) {
                        vm.environment.nest.addFood();
                        return false;
                    }
                    return true;
                };

                vm.antTouchedEnvironment = function (ant) {
                    if (!ant.hasFood) {
                        var foodIndex = vm.getTouchedFood(ant);
                        return vm.antTouchedFood(foodIndex);
                    }
                    else {
                        var nest = vm.getTouchedNest(ant);
                        return vm.antTouchedNest(nest, ant);
                    }
                };

                vm.updateAnts = function (delta) {
                    var pheromonesToAdd = [];
                    for (var idx in vm.environment.ants) {
                        if (vm.environment.ants[idx]) {
                            vm.environment.ants[idx].update({
                                box: vm.box,
                                ants: vm.environment.ants,
                                food: vm.environment.food,
                                pheromones: vm.environment.pheromones,
                                nest: vm.environment.nest
                            });

                            var pheromone = vm.environment.ants[idx].attemptToSpawnPheromone(delta);
                            vm.addPheromoneToEnvironment(pheromone);

                            vm.environment.ants[idx].hasFood = vm.antTouchedEnvironment(vm.environment.ants[idx]);
                        }
                    }

                    pheromonesToAdd.forEach(function (pheromone) {
                        //vm.spawnPheromone(pheromone);
                    });
                };

                vm.updatePheromones = function (delta) {
                    var deadPheromones = [];
                    vm.environment.pheromones.forEach(function (pheromone) {
                        if (pheromone.update(delta)) {
                            deadPheromones.push(pheromone);
                        }
                    });

                    deadPheromones.forEach(function (dead) {
                        vm.environment.pheromones.splice(vm.environment.pheromones.indexOf(dead), 1);
                    });
                };

                vm.update = function () {
                    if (vm.active) {
                        var currTime = new Date().getTime(),
                            delta = Math.min((currTime - vm.lastTime) / 1000, 1.0);

                        vm.lastTime = currTime;

                        vm.spawnAnt(delta);
                        vm.updateAnts(delta);
                        vm.updatePheromones(delta);
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
                            controller: 'AntController',
                            controllerAs: 'antCtrl'
                        }
                    }
                });
        }]);
}(angular));