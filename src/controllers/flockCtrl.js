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
                    speed: 3.0,
                    cohesionWeight: 0.2,
                    separateWeight: 0.2,
                    alignWeight: 0.1,
                    wanderWeight: 0.5
                };
                $scope.preyStats = {
                    speed: 2.5,
                    cohesionWeight: 0.1,
                    separateWeight: 0.1,
                    alignWeight: 0.1,
                    avoidWeight: 1.0,
                    wanderWeight: 0//0.25
                };
                $scope.gameType = WOLVES;

                $scope.$watch('box', function (newVal, oldVal) {
                    if (newVal === oldVal) {
                        return;
                    }
                    if (_.isNumber(newVal.width) && _.isNumber(newVal.height) && _.isObject(newVal.center)) {
                        //$scope.reset();
                    }
                });

                $scope.$watch('preyStats', function (newVal, oldVal) {
                    if (newVal === oldVal) {
                        return;
                    }
                    else {
                        for (var which in $scope.entities.prey) {
                            $scope.entities.prey[which].updateStats({
                                speed: parseFloat(newVal.speed),
                                cohesionWeight: parseFloat(newVal.cohesionWeight),
                                separateWeight: parseFloat(newVal.separateWeight),
                                alignWeight: parseFloat(newVal.alignWeight),
                                wanderWeight: parseFloat(newVal.wanderWeight)
                            });
                        }
                    }
                }, true);

                $scope.$watch('predatorStats', function (newVal, oldVal) {
                    if (newVal === oldVal) {
                        return;
                    }
                    else {
                        for (var which in $scope.entities.predators) {
                            $scope.entities.predators[which].updateStats({
                                speed: parseFloat(newVal.speed),
                                cohesionWeight: parseFloat(newVal.cohesionWeight),
                                separateWeight: parseFloat(newVal.separateWeight),
                                alignWeight: parseFloat(newVal.alignWeight),
                                wanderWeight: parseFloat(newVal.wanderWeight)
                            });
                        }
                    }
                }, true);

                /**
                 * Changes gameType from WOLVES to ZOMBIES or vice versa
                 * Resets the game state
                 */
                $scope.toggleGameType = function () {
                    $scope.gameType = $scope.gameType === WOLVES ? ZOMBIES : WOLVES;
                    $scope.reset();
                };

                $scope.reset = function () {
                    $scope.entities.prey = $scope.createPrey($scope.preyAmount);
                    $scope.entities.predators = $scope.createPredators($scope.predatorAmount);
                };

                $scope.createPrey = function (num) {
                    var retArray = [];
                    for (var idx = 0; idx < num; idx++) {
                        retArray.push(new FlockEntity({
                            position: new Vector({
                                x: MathUtils.getRandomNumber(0, $scope.box.width),
                                y: MathUtils.getRandomNumber(0, $scope.box.height)
                            }),
                            velocity: new Vector({
                                x: MathUtils.getRandomNumber(-1, 1),
                                y: MathUtils.getRandomNumber(-1, 1)
                            }),
                            speed: parseFloat($scope.preyStats.speed),
                            cohesionWeight: parseFloat($scope.preyStats.cohesionWeight),
                            avoidWeight: parseFloat($scope.preyStats.avoidWeight),
                            separateWeight: parseFloat($scope.preyStats.separateWeight),
                            alignWeight: parseFloat($scope.preyStats.alignWeight),
                            wanderWeight: parseFloat($scope.preyStats.wanderWeight),
                            type: FlockEntity.PREY,
                            color: DrawUtils.getRandomGreen()
                        }));
                    }
                    return retArray;
                };

                $scope.createPredators = function (num) {
                    var retArray = [];
                    for (var idx = 0; idx < num; idx++) {
                        retArray.push(new FlockEntity({
                            position: Vector.build({
                                x: MathUtils.getRandomNumber(0, $scope.box.width),
                                y: MathUtils.getRandomNumber(0, $scope.box.height)
                            }),
                            velocity: Vector.build({
                                x: MathUtils.getRandomNumber(-1, 1),
                                y: MathUtils.getRandomNumber(-1, 1)
                            }),
                            speed: parseFloat($scope.predatorStats.speed),
                            cohesionWeight: parseFloat($scope.predatorStats.cohesionWeight),
                            separateWeight: parseFloat($scope.predatorStats.separateWeight),
                            alignWeight: parseFloat($scope.predatorStats.alignWeight),
                            wanderWeight: parseFloat($scope.predatorStats.wanderWeight),
                            type: FlockEntity.PREDATOR,
                            color: DrawUtils.getRandomRed()
                        }));
                    }
                    return retArray;
                };

                $scope.update = function () {
                    $scope.entities.predators.forEach(function (predator) {
                        predator.update({
                            box: $scope.box,
                            prey: MathUtils.getNearestObjects($scope.entities.prey, predator, 50.0),
                            predators: $scope.entities.predators
                        });
                    });
                    $scope.entities.prey.forEach(function (prey) {
                        prey.update({
                            box: $scope.box,
                            prey: MathUtils.getNearestObjects($scope.entities.prey, prey, 50.0),
                            predators: MathUtils.getNearestObjects($scope.entities.predators, prey, 50.0)
                        });
                    });

                    $scope['updatePrey' + $scope.gameType]();
                    $scope.$apply();
                };

                $scope.updatePreyWolves = function () {
                    $scope.entities.predators.forEach(function (predator) {
                        var toKill = MathUtils.getNearestObjects($scope.entities.prey, predator, 7);
                        toKill.forEach(function (dead) {
                            $scope.entities.prey.splice($scope.entities.prey.indexOf(dead), 1);
                            console.log("Wolves got a kill! AWOOOO!");
                        });
                    });
                };

                $scope.updatePreyZombies = function () {
                    $scope.entities.predators.forEach(function (predator) {
                        var toKill = MathUtils.getNearestObjects($scope.entities.prey, predator, 7);
                        toKill.forEach(function (dead) {
                            $scope.entities.predators.push(new FlockEntity({
                                position: new Vector({
                                    x: dead.position.x,
                                    y: dead.position.y
                                }),
                                velocity: new Vector({
                                    x: dead.velocity.x,
                                    y: dead.velocity.y
                                }),
                                speed: parseFloat($scope.predatorStats.speed),
                                cohesionWeight: parseFloat($scope.predatorStats.cohesionWeight),
                                separateWeight: parseFloat($scope.predatorStats.separateWeight),
                                alignWeight: parseFloat($scope.predatorStats.alignWeight),
                                wanderWeight: parseFloat($scope.predatorStats.wanderWeight),
                                type: FlockEntity.PREDATOR,
                                color: DrawUtils.getRandomRed()
                            }));
                            $scope.entities.prey.splice($scope.entities.prey.indexOf(dead), 1);
                            console.log("Oh no, they got Timmy!");
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