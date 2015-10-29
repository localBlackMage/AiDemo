(function (ng) {
    'use strict';

    ng.module('aidemo.life', [
        'ui.router',
        'aidemo.service.utils',
        'aidemo.service.mathUtils',
        'aidemo.service.drawUtils',
        'aidemo.service.lifeCellService',
        'aidemo.models.lifeCell'
    ])
        .controller('LifeController', ['$scope', 'Utils', 'MathUtils', 'DrawUtils', 'LifeCellService', 'LifeCell',
            function ($scope, Utils, MathUtils, DrawUtils, LifeCellService, LifeCell) {
                $scope.BACK_COLOR = "#555555";
                $scope.GRID_COLOR = "#8EAEC9";
                $scope.generation = 0;
                $scope.step = 1;
                $scope.pause = true;
                $scope.gridObj = {
                    grid: [],
                    tileSize: 10
                };
                $scope.lastTime = 0;
                $scope.cumulativeTime = 0;

                $scope.generateGrid = function () {
                    var de,
                        numberOfRows = $scope.box.height / $scope.gridObj.tileSize,
                        numberOfColumns = $scope.box.width / $scope.gridObj.tileSize;
                    $scope.gridObj.grid = [];
                    for (var row = 0; row < numberOfRows; row++) {
                        var currentRow = [];
                        for (var col = 0; col < numberOfColumns; col++) {
                            de = MathUtils.getRandomNumber(0, 1) < 0.1;
                            currentRow.push((new LifeCell({
                                box: {
                                    x: col * $scope.gridObj.tileSize,
                                    y: row * $scope.gridObj.tileSize,
                                    width: $scope.gridObj.tileSize,
                                    height: $scope.gridObj.tileSize
                                },
                                status: de ? LifeCell.ALIVE : LifeCell.DEAD,
                                DEAD_COLOR: $scope.BACK_COLOR
                            })));
                        }
                        $scope.gridObj.grid.push(currentRow);
                    }
                    LifeCellService.fillGridNeighbors($scope.gridObj.grid, false);
                };

                $scope.nextGeneration = function () {
                    $scope.generation++;
                    var copy = LifeCellService.deepCopyGrid($scope.gridObj.grid);
                    for (var y = 0; y < $scope.gridObj.grid.length; y++) {
                        for (var x = 0; x < $scope.gridObj.grid[y].length; x++) {
                            $scope.gridObj.grid[y][x].setStatus(copy[y][x].update());
                        }
                    }
                    $scope.$apply();
                };

                $scope.update = function () {
                    if ($scope.pause) {
                        return;
                    }
                    else {
                        var currTime = new Date().getTime();
                        $scope.cumulativeTime += (currTime - $scope.lastTime) / 1000;
                        $scope.lastTime = currTime;

                        if ($scope.cumulativeTime > $scope.step) {
                            $scope.nextGeneration();
                            $scope.cumulativeTime = 0;
                        }

                    }
                };

                $scope.reset = function () {
                    $scope.generateGrid();
                    $scope.generation = 0;
                };

                $scope.pauseToggle = function () {
                    $scope.pause = !$scope.pause;

                    if ($scope.gridObj.grid.length === 0) {
                        $scope.generateGrid();
                    }
                };

                $scope.spawnCell = function (x, y) {
                    var newX = Math.round(x / $scope.gridObj.tileSize) - 1,
                        newY = Math.round(y / $scope.gridObj.tileSize) - 1;
                    $scope.gridObj.grid[newY][newX].setStatus(LifeCell.ALIVE);
                };

                $scope.touch = function (event) {
                    if ($scope.pause || $scope.gridObj.grid.length === 0) {
                        return;
                    }
                    var x = event.offsetX - 1,
                        y = event.offsetY - 1;

                    $scope.spawnCell(x, y);
                };
            }])

        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                .state('app.life', {
                    url: 'life',

                    resolve: {},

                    views: {
                        'main@': {
                            templateUrl: 'lifeDemo.html',
                            controller: 'LifeController'
                        }
                    }
                });
        }]);

}(angular));