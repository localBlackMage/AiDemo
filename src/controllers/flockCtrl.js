(function (ng) {
    'use strict';

    ng.module('aidemo.flock', [
        'ui.router',
        'aidemo.service.mathUtils',
        'aidemo.service.drawUtils',
        'aidemo.models.vector',
        'aidemo.models.flockEntity'
    ])
        .controller("FlockController", ['$scope', 'MathUtils', 'DrawUtils', 'Vector', 'FlockEntity',
            function ($scope, MathUtils, DrawUtils, Vector, FlockEntity) {
                var vm = this, WOLVES = 'Wolves', ZOMBIES = 'Zombies';
                vm.box = {};
                vm.BACK_COLOR = "#555555";
                vm.GRID_COLOR = "#8EAEC9";
                vm.entities = {
                    prey: [],
                    predators: []
                };
                vm.preyAmount = 200;
                vm.predatorAmount = 2;
                vm.predatorStats = {
                    speed: 0.7,
                    cohesionWeight: 0.5,
                    separateWeight: 0.5,
                    alignWeight: 0.5
                };
                vm.preyStats = {
                    speed: 0.5,
                    cohesionWeight: 0.5,
                    separateWeight: 0.51,
                    alignWeight: 0.49,
                    avoidWeight: 1.0
                };
                vm.gameType = WOLVES;

                vm.updateStats = function (newStats, entityType) {
                    for (var entity in vm.entities[entityType]) {
                        if (vm.entities[entityType][entity]) {
                            vm.entities[entityType][entity].updateStats({
                                speed: parseFloat(newStats.speed),
                                cohesionWeight: parseFloat(newStats.cohesionWeight),
                                separateWeight: parseFloat(newStats.separateWeight),
                                alignWeight: parseFloat(newStats.alignWeight)
                            });
                        }
                    }
                };

                $scope.$watch('preyStats', function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        vm.updateStats(newVal, 'prey');
                    }
                }, true);

                $scope.$watch('predatorStats', function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        vm.updateStats(newVal, 'predators');
                    }
                }, true);

                /**
                 * Changes gameType from WOLVES to ZOMBIES or vice versa
                 * Resets the game state
                 */
                vm.toggleGameType = function () {
                    vm.gameType = vm.gameType === WOLVES ? ZOMBIES : WOLVES;
                    vm.clear();
                };

                vm.reset = function () {
                    vm.entities.prey = vm.createPreyArray(vm.preyAmount);
                    vm.entities.predators = vm.createPredatorsArray(vm.predatorAmount);
                };

                vm.createFlockEntity = function (stats, positionAndVelocity, type) {
                    return new FlockEntity({
                        position: positionAndVelocity.position,
                        velocity: positionAndVelocity.velocity,
                        speed: parseFloat(stats.speed),
                        cohesionWeight: parseFloat(stats.cohesionWeight),
                        avoidWeight: parseFloat(stats.avoidWeight),
                        separateWeight: parseFloat(stats.separateWeight),
                        alignWeight: parseFloat(stats.alignWeight),
                        type: type
                    });
                };

                vm.createPreyArray = function (num) {
                    var retArray = [];
                    for (var idx = 0; idx < num; idx++) {
                        retArray.push(vm.createFlockEntity(vm.preyStats, {
                            position: new Vector({
                                x: MathUtils.getRandomNumber(0, vm.box.width),
                                y: MathUtils.getRandomNumber(0, vm.box.height)
                            }),
                            velocity: new Vector({
                                x: MathUtils.getRandomNumber(-1, 1),
                                y: MathUtils.getRandomNumber(-1, 1)
                            })
                        }, FlockEntity.PREY));
                    }
                    return retArray;
                };

                vm.createPredatorsArray = function (num) {
                    var retArray = [];
                    for (var idx = 0; idx < num; idx++) {
                        retArray.push(vm.createFlockEntity(vm.predatorStats, {
                            position: new Vector({
                                x: MathUtils.getRandomNumber(0, vm.box.width),
                                y: MathUtils.getRandomNumber(0, vm.box.height)
                            }),
                            velocity: new Vector({
                                x: MathUtils.getRandomNumber(-1, 1),
                                y: MathUtils.getRandomNumber(-1, 1)
                            })
                        }, FlockEntity.PREDATOR));
                    }
                    return retArray;
                };

                vm.updateEntity = function (entity) {
                    entity.update({
                        box: vm.box,
                        prey: vm.entities.prey,
                        predators: vm.entities.predators
                    });
                };

                vm.update = function () {
                    vm.entities.predators.forEach(function (predator) {
                        vm.updateEntity(predator);
                    });
                    vm.entities.prey.forEach(function (prey) {
                        vm.updateEntity(prey);
                    });

                    vm.predatorsKillPrey();
                    $scope.$apply();
                };

                vm.killPreyZombies = function (prey) {
                    vm.entities.predators.push(vm.createFlockEntity(vm.predatorStats, prey, FlockEntity.PREDATOR));
                    vm.entities.prey.splice(vm.entities.prey.indexOf(prey), 1);
                };

                vm.killPreyWolves = function (prey) {
                    vm.entities.prey.splice(vm.entities.prey.indexOf(prey), 1);
                };

                vm.predatorsKillPrey = function () {
                    vm.entities.predators.forEach(function (predator) {
                        var toKill = MathUtils.getNearestObjects(vm.entities.prey, predator, 7);
                        toKill.forEach(function (deadPrey) {
                            vm['killPrey' + vm.gameType](deadPrey);
                        });
                    });
                };

                vm.clear = function () {
                    vm.entities.prey = [];
                    vm.entities.predators = [];
                };
            }
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                .state('app.flock', {
                    url: 'flock',

                    resolve: {},

                    views: {
                        'main@': {
                            templateUrl: 'flockDemo.html',
                            controller: 'FlockController',
                            controllerAs: 'FlockCtrl'
                        }
                    }
                });
        }]);
}(angular));