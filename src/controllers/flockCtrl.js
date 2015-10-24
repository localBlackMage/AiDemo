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
                var WOLVES = 'Wolves!', ZOMBIES = 'Zombies!';
                $scope.box = {};
                $scope.BACK_COLOR = "#555555";
                $scope.GRID_COLOR = "#8EAEC9";
                $scope.entities = {
                    prey: [],
                    predators: []
                };
                $scope.preyAmount = 5;
                $scope.predatorAmount = 5;
                $scope.predatorStats = {
                    speed: 3.0,
                    cohesionWeight: 0.2,
                    separateWeight: 0.2,
                    alignWeight: 0.1,
                    wanderWeight: 0.5
                };
                $scope.preyStats = {
                    speed: 2.0,
                    cohesionWeight: 0.4,
                    separateWeight: 0.4,
                    alignWeight: 0.2,
                    avoidWeight: 1.0,
                    wanderWeight: 0.2
                };
                $scope.gameType = "Wolves!";

                $scope.$watch('box', function (newVal, oldVal) {
                    if (newVal === oldVal) {
                        return;
                    }
                    if (_.isNumber(newVal.width) && _.isNumber(newVal.height) && _.isObject(newVal.center)) {
                        $scope.reset();
                    }
                });

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
                    //$scope.entities.predators = createPredators($scope.predatorAmount);
                };

                $scope.createPrey = function (num) {
                    var retArray = [];

                    for (var idx = 0; idx < num; idx++) {
                        retArray.push(FlockEntity.build({
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

                    //$scope[$scope.wolfOrZombie]();
                    //$scope.preyAmtLeft = $scope.herd.length;
                };

                //var createPredators = function (num) {
                //    var retArray = [];
                //    for (var idx = 0; idx < num; idx++) {
                //        retArray.push(FlockEntity.build({
                //            pos: Vector.build({
                //                x: MathUtils.getRandomNumber(0, $scope.canvas.width),
                //                y: MathUtils.getRandomNumber(0, $scope.canvas.height)
                //            }),
                //            vel: Vector.build({x: MathUtils.getRandomNumber(-1, 1), y: MathUtils.getRandomNumber(-1, 1)}),
                //            speed: parseFloat($scope.predStats.speed),
                //            cohesionWeight: parseFloat($scope.predStats.cohesionWeight),
                //            separateWeight: parseFloat($scope.predStats.separateWeight),
                //            alignWeight: parseFloat($scope.predStats.alignWeight),
                //            wanderWeight: parseFloat($scope.predStats.wanderWeight),
                //            type: FlockEntity.PREDATOR,
                //            color: DrawUtils.getRandomRed()
                //        }));
                //    }
                //    return retArray;
                //};
                //

                //
                //$scope.killPrey = function () {
                //    $scope.predators.forEach(function (pred) {
                //        var toKill = MathUtils.getNearestObjects($scope.herd, pred, 7);
                //        toKill.forEach(function (dead) {
                //            $scope.herd.splice($scope.herd.indexOf(dead), 1);
                //            console.log("Wolves got a kill! AWOOOO!");
                //        });
                //    });
                //};
                //
                //$scope.turnToZombie = function () {
                //    $scope.predators.forEach(function (pred) {
                //        var toKill = MathUtils.getNearestObjects($scope.herd, pred, 7);
                //        toKill.forEach(function (dead) {
                //            var options = {
                //                pos: New(Vector, {x: dead.pos.x, y: dead.pos.y}),
                //                vel: New(Vector, {x: dead.vel.x, y: dead.vel.y}),
                //                speed: parseFloat($scope.predStats.speed),
                //                cohesionWeight: parseFloat($scope.predStats.cohesionWeight),
                //                separateWeight: parseFloat($scope.predStats.separateWeight),
                //                alignWeight: parseFloat($scope.predStats.alignWeight),
                //                wanderWeight: parseFloat($scope.predStats.wanderWeight),
                //                type: PREDATOR,
                //                color: DrawUtils.getRandomRed()
                //            };
                //            $scope.predators.push(New(Entity, options));
                //            $scope.herd.splice($scope.herd.indexOf(dead), 1);
                //            console.log("Oh no, they got Timmy!");
                //        });
                //    });
                //};
                //
                //
                //
                //$scope.render = function () {
                //    $scope.predators.forEach(function (s) {
                //        s.render($scope.ctx);
                //    });
                //    $scope.herd.forEach(function (s) {
                //        s.render($scope.ctx);
                //    });
                //};
                //
                //
                //$scope.clear = function () {
                //    $scope.herd = [];
                //    $scope.predators = [];
                //};
                //
                //$scope.setStat = function (which, amt) {
                //    for (var x = 0; x < $scope.predators.length; x++) {
                //        $scope.predators[x][which] = amt;
                //    }
                //    for (var y = 0; y < $scope.herd.length; y++) {
                //        $scope.herd[y][which] = amt;
                //    }
                //};
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