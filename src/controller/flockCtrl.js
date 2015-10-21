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
                var CAN_BACK = "#222", GRID_COLOR = "#555";
                var createHerd = function (num) {
                    var retArray = [];
                    for (var idx = 0; idx < num; idx++) {
                        retArray.push(FlockEntity.build({
                            pos: Vector.build({
                                x: MathUtils.getRand(0, $scope.canvas.width),
                                y: MathUtils.getRand(0, $scope.canvas.height)
                            }),
                            vel: Vector.build({x: MathUtils.getRand(-1, 1), y: MathUtils.getRand(-1, 1)}),
                            speed: parseFloat($scope.preyStats.speed),
                            cohW: parseFloat($scope.preyStats.cohW),
                            avoW: parseFloat($scope.preyStats.avoW),
                            sepW: parseFloat($scope.preyStats.sepW),
                            aliW: parseFloat($scope.preyStats.aliW),
                            wanW: parseFloat($scope.preyStats.wanW),
                            type: FlockEntity.PREY,
                            color: DrawUtils.getRandomGreen()
                        }));
                    }
                    return retArray;
                };
                var createPredators = function (num) {
                    var retArray = [];
                    for (var idx = 0; idx < num; idx++) {
                        retArray.push(FlockEntity.build({
                            pos: Vector.build({
                                x: MathUtils.getRand(0, $scope.canvas.width),
                                y: MathUtils.getRand(0, $scope.canvas.height)
                            }),
                            vel: Vector.build({x: MathUtils.getRand(-1, 1), y: MathUtils.getRand(-1, 1)}),
                            speed: parseFloat($scope.predStats.speed),
                            cohW: parseFloat($scope.predStats.cohW),
                            sepW: parseFloat($scope.predStats.sepW),
                            aliW: parseFloat($scope.predStats.aliW),
                            wanW: parseFloat($scope.predStats.wanW),
                            type: FlockEntity.PREDATOR,
                            color: DrawUtils.getRandomRed()
                        }));
                    }
                    return retArray;
                };

                $scope.canvas = $('#flockCanvas')[0];
                $scope.box = {
                    width: $scope.canvas.width,
                    height: $scope.canvas.height,
                    center: Vector.build({x: $scope.canvas.width / 2, y: $scope.canvas.height / 2})
                };
                $scope.ctx = $scope.canvas.getContext('2d');
                $scope.herd = [];
                $scope.predators = [];
                $scope.preyAmt = 5;
                $scope.predAmt = 5;
                $scope.predStats = {
                    speed: 3.0,
                    cohW: 0.2,
                    sepW: 0.2,
                    aliW: 0.1,
                    wanW: 0.5
                };
                $scope.preyStats = {
                    speed: 1.5,
                    cohW: 0.4,
                    sepW: 0.4,
                    aliW: 0.2,
                    avoW: 1.0,
                    wanW: 0.2
                };

                $scope.wolfOrZombie = "killPrey";
                $scope.wozDisplay = "Wolves!";

                $scope.killPrey = function () {
                    $scope.predators.forEach(function (pred) {
                        var toKill = MathUtils.getNearest($scope.herd, pred, 7);
                        toKill.forEach(function (dead) {
                            $scope.herd.splice($scope.herd.indexOf(dead), 1);
                            console.log("Wolves got a kill! AWOOOO!");
                        });
                    });
                };

                $scope.turnToZombie = function () {
                    $scope.predators.forEach(function (pred) {
                        var toKill = MathUtils.getNearest($scope.herd, pred, 7);
                        toKill.forEach(function (dead) {
                            var options = {
                                pos: New(Vector, {x: dead.pos.x, y: dead.pos.y}),
                                vel: New(Vector, {x: dead.vel.x, y: dead.vel.y}),
                                speed: parseFloat($scope.predStats.speed),
                                cohW: parseFloat($scope.predStats.cohW),
                                sepW: parseFloat($scope.predStats.sepW),
                                aliW: parseFloat($scope.predStats.aliW),
                                wanW: parseFloat($scope.predStats.wanW),
                                type: PREDATOR,
                                color: DrawUtils.getRandomRed()
                            };
                            $scope.predators.push(New(Entity, options));
                            $scope.herd.splice($scope.herd.indexOf(dead), 1);
                            console.log("Oh no, they got Timmy!");
                        });
                    });
                };

                $scope.update = function () {
                    $scope.predators.forEach(function (s) {
                        s.update({
                            box: $scope.box,
                            herd: MathUtils.getNearest($scope.herd, s, 50.0),
                            pred: $scope.predators
                        });
                    });
                    $scope.herd.forEach(function (s) {
                        s.update({
                            box: $scope.box,
                            herd: MathUtils.getNearest($scope.herd, s, 50.0),
                            pred: MathUtils.getNearest($scope.predators, s, 50.0)
                        });
                    });

                    $scope[$scope.wolfOrZombie]();
                    $scope.preyAmtLeft = $scope.herd.length;
                };

                $scope.toggleWolfOrZombie = function () {
                    if ($scope.wolfOrZombie == "killPrey") {
                        $scope.wolfOrZombie = "turnToZombie";
                        $scope.wozDisplay = "Zombies!";
                    }
                    else if ($scope.wolfOrZombie == "turnToZombie") {
                        $scope.wolfOrZombie = "killPrey";
                        $scope.wozDisplay = "Wolves!";
                    }
                    $scope.reset();
                };

                $scope.render = function () {
                    DrawUtils.fillCanvas($scope.canvas, CAN_BACK);
                    DrawUtils.drawGrid($scope.ctx, $scope.box, 50, GRID_COLOR);
                    $scope.predators.forEach(function (s) {
                        s.render($scope.ctx);
                    });
                    $scope.herd.forEach(function (s) {
                        s.render($scope.ctx);
                    });
                };

                $scope.reset = function () {
                    $scope.herd = createHerd($scope.preyAmt);
                    $scope.predators = createPredators($scope.predAmt);
                };

                $scope.clear = function () {
                    $scope.herd = [];
                    $scope.predators = [];
                };

                $scope.setStat = function (which, amt) {
                    for (var x = 0; x < $scope.predators.length; x++) {
                        $scope.predators[x][which] = amt;
                    }
                    for (var y = 0; y < $scope.herd.length; y++) {
                        $scope.herd[y][which] = amt;
                    }
                };

                // Animation
                window.requestAnimFrame = (function (callback) {
                    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
                        function (callback) {
                            window.setTimeout(callback, 1000 / 60);
                        };
                })();

                $scope.animate = function () {
                    $scope.update();
                    $scope.render();
                    $scope.$apply();
                    // request new frame
                    requestAnimFrame(function () {
                        $scope.animate();
                    });
                };

                setTimeout(function () {
                    $scope.animate();
                }, 0);
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