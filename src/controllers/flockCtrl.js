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
                var WOLVES = 'Wolves', ZOMBIES = 'Zombies';
                $scope.box = {};
                $scope.BACK_COLOR = "#555555";
                $scope.GRID_COLOR = "#8EAEC9";
                $scope.entities = {
                    prey: [],
                    predators: []
                };
                $scope.preyAmount = 20;
                $scope.predatorAmount = 5;
                $scope.predatorStats = {
                    speed: 2.0,
                    cohesionWeight: 0.5,
                    separateWeight: 0.5,
                    alignWeight: 0.5
                };
                $scope.preyStats = {
                    speed: 2.2,
                    cohesionWeight: 0.5,
                    separateWeight: 0.5,
                    alignWeight: 0.5,
                    avoidWeight: 1.0
                };
                $scope.gameType = WOLVES;

                $scope.updateStats = function (newStats, entityType) {
                    for (var entity in $scope.entities[entityType]) {
                        $scope.entities[entityType][entity].updateStats({
                            speed: parseFloat(newStats.speed),
                            cohesionWeight: parseFloat(newStats.cohesionWeight),
                            separateWeight: parseFloat(newStats.separateWeight),
                            alignWeight: parseFloat(newStats.alignWeight)
                        });
                    }
                };

                $scope.$watch('preyStats', function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        $scope.updateStats(newVal, 'prey');
                    }
                }, true);

                $scope.$watch('predatorStats', function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        $scope.updateStats(newVal, 'predators');
                    }
                }, true);

                /**
                 * Changes gameType from WOLVES to ZOMBIES or vice versa
                 * Resets the game state
                 */
                $scope.toggleGameType = function () {
                    $scope.gameType = $scope.gameType === WOLVES ? ZOMBIES : WOLVES;
                    $scope.clear();
                };

                $scope.reset = function () {
                    $scope.entities.prey = $scope.createPreyArray($scope.preyAmount);
                    $scope.entities.predators = $scope.createPredatorsArray($scope.predatorAmount);
                };

                $scope.createFlockEntity = function (stats, positionAndVelocity, type) {
                    return new FlockEntity({
                        position: positionAndVelocity.position,
                        velocity: positionAndVelocity.velocity,
                        speed: parseFloat(stats.speed),
                        cohesionWeight: parseFloat(stats.cohesionWeight),
                        avoidWeight: parseFloat(stats.avoidWeight),
                        separateWeight: parseFloat(stats.separateWeight),
                        alignWeight: parseFloat(stats.alignWeight),
                        type: type
                    })
                };

                $scope.createPreyArray = function (num) {
                    var retArray = [];
                    for (var idx = 0; idx < num; idx++) {
                        retArray.push($scope.createFlockEntity($scope.preyStats, {
                            position: new Vector({
                                x: MathUtils.getRandomNumber(0, $scope.box.width),
                                y: MathUtils.getRandomNumber(0, $scope.box.height)
                            }),
                            velocity: new Vector({
                                x: MathUtils.getRandomNumber(-1, 1),
                                y: MathUtils.getRandomNumber(-1, 1)
                            })
                        }, FlockEntity.PREY));
                    }
                    return retArray;
                };

                $scope.createPredatorsArray = function (num) {
                    var retArray = [];
                    for (var idx = 0; idx < num; idx++) {
                        retArray.push($scope.createFlockEntity($scope.predatorStats, {
                            position: new Vector({
                                x: MathUtils.getRandomNumber(0, $scope.box.width),
                                y: MathUtils.getRandomNumber(0, $scope.box.height)
                            }),
                            velocity: new Vector({
                                x: MathUtils.getRandomNumber(-1, 1),
                                y: MathUtils.getRandomNumber(-1, 1)
                            })
                        }, FlockEntity.PREDATOR));
                    }
                    return retArray;
                };

                $scope.updateEntity = function (entity) {
                    entity.update({
                        box: $scope.box,
                        prey: $scope.entities.prey,
                        predators: $scope.entities.predators
                    });
                };

                $scope.update = function () {
                    $scope.entities.predators.forEach(function (predator) {
                        $scope.updateEntity(predator);
                    });
                    $scope.entities.prey.forEach(function (prey) {
                        $scope.updateEntity(prey);
                    });

                    $scope.predatorsKillPrey();
                    $scope.$apply();
                };

                $scope.killPreyZombies = function (prey) {
                    $scope.entities.predators.push($scope.createFlockEntity($scope.predatorStats, prey, FlockEntity.PREDATOR));
                    $scope.entities.prey.splice($scope.entities.prey.indexOf(prey), 1);
                };

                $scope.killPreyWolves = function (prey) {
                    $scope.entities.prey.splice($scope.entities.prey.indexOf(prey), 1);
                };

                $scope.predatorsKillPrey = function () {
                    $scope.entities.predators.forEach(function (predator) {
                        var toKill = MathUtils.getNearestObjects($scope.entities.prey, predator, 7);
                        toKill.forEach(function (deadPrey) {
                            $scope['killPrey' + $scope.gameType](deadPrey);
                        });
                    });
                };

                $scope.clear = function () {
                    $scope.entities.prey = [];
                    $scope.entities.predators = [];
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
                            controller: 'FlockController'
                        }
                    }
                });
        }]);
}(angular));