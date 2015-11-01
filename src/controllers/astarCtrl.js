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
                    //paths: [],
                    tileSize: 50.0
                };
                $scope.start = null;
                $scope.end = null;

                $scope.markPath = function (path) {
                    console.log(path);
                    if (!path) {
                        return;
                    }
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
                                    node.reset();
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
                                if (node && node.selected && !node.special && node.specialSelect(position)) {
                                    $scope.end = node;
                                }
                            });
                        });
                        if ($scope.start && $scope.end) {
                            $scope.markPath(AStar.aStarAlgorithm($scope.start, $scope.end, $scope.gridObj.grid, $scope.gridObj.tileSize));
                        }
                    }
                    else {
                        $scope.start = null;
                        $scope.end = null;

                        $scope.gridObj.grid.forEach(function (row) {
                            row.forEach(function (node) {
                                if (node) {
                                    node.reset();
                                }
                            });
                        });
                    }
                };

                $scope.generateGrid = function () {
                    var curId = 0,
                        tCalc = $scope.gridObj.tileSize / 2,
                        yDifference = $scope.box.height - $scope.gridObj.tileSize,
                        xDifference = $scope.box.width - $scope.gridObj.tileSize,
                        columns = yDifference / $scope.gridObj.tileSize,
                        rows = xDifference / $scope.gridObj.tileSize;
                    $scope.gridObj.grid = [];
                    for (var y = 0; y < columns; y++) {
                        var arr = [];
                        for (var x = 0; x < rows; x++) {
                            var spawn = true;//MathUtils.getRandomNumber(0, 1) < 0.8 ? true : false;
                            if (spawn) {
                                var position = new Vector({
                                    x: x * $scope.gridObj.tileSize + tCalc + rows,
                                    y: y * $scope.gridObj.tileSize + tCalc + columns
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

                $scope.touch = function (event) {
                    if ($scope.gridObj.grid.length === 0 || (event.type !== 'mouseup' && event.type !== 'touchend')) {
                        return;
                    }
                    var position = new Vector({
                        x: event.offsetX - 1,
                        y: event.offsetY - 1
                    });

                    $scope.detect(position);
                };

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