(function (ng) {
    'use strict';

    ng.module('aidemo.astar', [
        'ui.router',
        'aidemo.service.utils',
        'aidemo.service.mathUtils',
        'aidemo.service.aStar',
        'aidemo.service.gridService',
        'aidemo.models.vector',
        'aidemo.models.node'
        //'aidemo.models.lifeCell'
    ])
        .controller('AStarController', ['$scope', '$timeout', 'AStar', 'GridService', 'MathUtils', 'Vector', 'Node',
            function ($scope, $timeout, AStar, GridService, MathUtils, Vector, Node) {
                $scope.BACK_COLOR = "#555555";
                $scope.GRID_COLOR = "#8EAEC9";
                $scope.step = 0.25;
                $scope.pause = false;
                $scope.gridObj = {
                    grid: [],
                    tileSize: 50
                };
                $scope.start = null;
                $scope.end = null;

                $scope.markPath = function (path) {
                    while (!path.isEmpty()) {
                        var node = path.dequeue();
                        node.pathSelect();
                    }
                };

                $scope.detect = function (position) {
                    if ($scope.start === null) {
                        $scope.gridObj.grid.forEach(function (row) {
                            row.forEach(function (node) {
                                if (node) {
                                    node.resetSelect();
                                    if (node.specialSelect(position)) {
                                        $scope.start = node;
                                    }
                                }
                            });
                        });

                        if ($scope.start) {
                            AStar.depthFirstSearch($scope.start, 5);
                        }
                    }
                    else if ($scope.end === null) {
                        $scope.gridObj.grid.forEach(function (row) {
                            row.forEach(function (node) {
                                if (node && node.selected && !node.special) {
                                    if (node.specialSelect(position)) {
                                        $scope.end = node;
                                    }
                                }
                            });
                        });
                        $scope.markPath(AStar.aStarAlgorithm($scope.start, $scope.end, $scope.gridObj.grid));
                    }
                    else {
                        $scope.start = null;
                        $scope.end = null;
                    }
                };

                $scope.generateGrid = function () {
                    var curId = 0,
                        tCalc = $scope.gridObj.tileSize / 2;
                    $scope.gridObj.grid = [];
                    for (var y = 0; y < $scope.box.height / $scope.gridObj.tileSize; y++) {
                        var arr = [];
                        for (var x = 0; x < $scope.box.width / $scope.gridObj.tileSize; x++) {
                            var spawn = true;//MathUtils.getRandomNumber(0, 1) < 0.8 ? true : false;
                            if (spawn) {
                                var position = new Vector({
                                    x: x * $scope.gridObj.tileSize + tCalc,
                                    y: y * $scope.gridObj.tileSize + tCalc
                                });
                                arr.push((new Node({
                                    box: {
                                        x: x * $scope.gridObj.tileSize,
                                        y: y * $scope.gridObj.tileSize,
                                        width: $scope.gridObj.tileSize,
                                        height: $scope.gridObj.tileSize
                                    },
                                    id: curId.toString(),
                                    position: position
                                })));
                            }
                            else {
                                arr.push(null);
                            }
                            curId++;
                        }
                        $scope.gridObj.grid.push(arr);
                    }
                    GridService.fillGridNeighbors($scope.gridObj.grid, true);
                };

                $scope.update = function () {

                };

                //$scope.render = function () {
                //    DrawUtils.fillCanvas($scope.canvas, CAN_BACK);
                //    DrawUtils.drawGrid($scope.ctx, $scope.box, GRID_SIZE, GRID_COLOR);
                //
                //    $scope.gridObj.grid.forEach(function (row) {
                //        row.forEach(function (node) {
                //            if (node)
                //                node.renderPaths($scope.ctx);
                //        });
                //    });
                //
                //    $scope.gridObj.grid.forEach(function (row) {
                //        row.forEach(function (node) {
                //            if (node)
                //                node.render($scope.ctx);
                //        });
                //    });
                //};

                // Setup
                $timeout($scope.generateGrid, 100);

                var test = function () {
                    for (var row = 0; row < $scope.gridObj.grid.length; row++) {
                        for (var col = 0; col < $scope.gridObj.grid[row].length; col++) {
                            if ($scope.gridObj.grid[row][col]) {
                                $scope.gridObj.grid[row][col].special = true;
                                AStar.depthFirstSearch($scope.gridObj.grid[row][col], 5);
                                return;
                            }
                        }
                    }
                };
                //test();

                //// Animation
                //window.requestAnimFrame = (function (callback) {
                //    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
                //        function (callback) {
                //            window.setTimeout(callback, 1000 / 60);
                //        };
                //})();
                //
                //$scope.animate = function (startTime) {
                //    var time = (new Date()).getTime() - startTime;
                //    if (time > $scope.step * 1000 && !$scope.pause) {
                //        startTime = (new Date()).getTime();
                //        $scope.update();
                //        $scope.render();
                //        $scope.$apply();
                //    }
                //    else if ($scope.pause) {
                //        startTime = (new Date()).getTime();
                //    }
                //    // request new frame
                //    requestAnimFrame(function () {
                //        $scope.animate(startTime);
                //    });
                //};
                //
                //setTimeout(function () {
                //    var startTime = (new Date()).getTime();
                //    $scope.animate(startTime);
                //}, 0);
            }])

        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                .state('app.astar', {
                    url: 'astar',

                    resolve: {},

                    views: {
                        'main@': {
                            templateUrl: 'astarDemo.html',
                            controller: 'AStarController'
                        }
                    }
                });
        }]);
}(angular));

//demoApp.directive('ngCanvasAi', function () {
//    return {
//        restrict: "A",
//        link: function (scope, element) {
////            var drawing = false;
//            element.bind('mousedown', function (event) {
//                scope.detect(New(Vector, {x: event.offsetX - 1, y: event.offsetY - 1}));
////                drawing = true;
//            });
////            element.bind('mousemove', function (event) {
////                if (drawing)
////                    scope.detect(New(Vector, {x: event.offsetX - 1, y: event.offsetY - 1}));
////            });
//            element.bind('mouseup', function (event) {
////                drawing = false;
//            });
//        }
//    };
//});