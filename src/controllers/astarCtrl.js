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
                $scope.gridObj = {
                    grid: [],
                    tileSize: 50.0
                };
                $scope.start = null;
                $scope.end = null;

                $scope.findNodeInGridAndPathSelect = function (node) {
                    if ($scope.gridObj.grid) {
                        var row = parseInt(node.id / $scope.gridObj.grid[0].length, 10),
                            column = parseInt(node.id - (row * $scope.gridObj.grid[0].length), 10);

                        $scope.gridObj.grid[row][column] = node;
                        $scope.gridObj.grid[row][column].pathSelect();
                    }
                };

                $scope.markPath = function (path) {
                    if (!path) {
                        return;
                    }
                    while (!path.isEmpty()) {
                        var node = path.dequeue();
                        $scope.findNodeInGridAndPathSelect(node);
                    }
                };

                $scope.createPath = function () {
                    if ($scope.start && $scope.end) {
                        $scope.markPath(
                            AStar.aStarAlgorithm(
                                $scope.start,
                                $scope.end,
                                $scope.gridObj.grid,
                                $scope.gridObj.tileSize
                            )
                        );
                    }
                };

                $scope.selectStartNode = function (position) {
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
                };

                $scope.selectEndNode = function (position) {
                    $scope.gridObj.grid.forEach(function (row) {
                        row.forEach(function (node) {
                            if (node && node.eligibleForSelect(position)) {
                                $scope.end = node;
                            }
                        });
                    });
                    $scope.createPath();
                };

                $scope.reset = function () {
                    $scope.start = null;
                    $scope.end = null;

                    for (var row = 0; row < $scope.gridObj.grid.length; row++) {
                        for (var column = 0; column < $scope.gridObj.grid[row].length; column++) {
                            if ($scope.gridObj.grid[row][column]) {
                                $scope.gridObj.grid[row][column].reset();
                            }
                        }
                    }
                };

                $scope.handleTouchPosition = function (position) {
                    if ($scope.start === null) {
                        $scope.selectStartNode(position);
                    }
                    else if ($scope.end === null) {
                        $scope.selectEndNode(position);
                    }
                    else {
                        $scope.reset();
                    }
                };

                $scope.generateNode = function (numberOfColumns, numberOfRows, column, row, offset, curId) {
                    var spawn = MathUtils.getRandomNumber(0, 1) <= 0.7;
                    return spawn ? new Node({
                        box: {
                            x: column * $scope.gridObj.tileSize,
                            y: row * $scope.gridObj.tileSize,
                            width: $scope.gridObj.tileSize,
                            height: $scope.gridObj.tileSize
                        },
                        id: curId.toString(),
                        position: new Vector({
                            x: column * $scope.gridObj.tileSize + offset + numberOfColumns,
                            y: row * $scope.gridObj.tileSize + offset + numberOfRows
                        })
                    }) : null;
                };

                $scope.generateGridRow = function (numberOfColumns, numberOfRows, row, offset, curId) {
                    var rowArray = [];
                    for (var column = 0; column < numberOfColumns; column++) {
                        rowArray.push($scope.generateNode(
                            numberOfColumns, numberOfRows,
                            column, row, offset, curId
                        ));
                        curId++;
                    }
                    return rowArray;
                };

                $scope.generateGrid = function () {
                    var curId = 0,
                        offset = $scope.gridObj.tileSize / 2,
                        xDifference = $scope.box.width - $scope.gridObj.tileSize,
                        yDifference = $scope.box.height - $scope.gridObj.tileSize,
                        numberOfColumns = xDifference / $scope.gridObj.tileSize,
                        numberOfRows = yDifference / $scope.gridObj.tileSize;

                    $scope.gridObj.grid = [];

                    for (var row = 0; row < numberOfRows; row++) {
                        $scope.gridObj.grid.push(
                            $scope.generateGridRow(numberOfColumns, numberOfRows, row, offset, curId)
                        );
                        curId += numberOfColumns;
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

                    $scope.handleTouchPosition(position);
                };

                $timeout($scope.generateGrid, 100);
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