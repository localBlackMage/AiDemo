(function (ng) {
    'use strict';

    ng.module('aidemo.life', [
        'ui.router',
        'aidemo.service.utils',
        'aidemo.service.mathUtils',
        'aidemo.service.drawUtils',
        'aidemo.models.vector',
        'aidemo.models.lifeCell'
    ])
        .controller('LifeController', ['$scope', 'Utils', 'MathUtils', 'DrawUtils', 'LifeCell',
            function ($scope, Utils, MathUtils, DrawUtils, LifeCell) {
            $scope.BACK_COLOR = "#555555";
            $scope.GRID_COLOR = "#8EAEC9";

            //// Scope Fields
            //$scope.canvas = $('#lifeCanvas')[0];
            //$scope.box = {
            //    width: $scope.canvas.width,
            //    height: $scope.canvas.height,
            //    center: New(Vector, {x: $scope.canvas.width / 2, y: $scope.canvas.height / 2})
            //};
            //$scope.ctx = $scope.canvas.getContext('2d');

            $scope.generation = 0;
            $scope.step = 1;
            $scope.pause = true;
            $scope.gridObj = {
                grid: [],
                tileSize: 20
            };
            $scope.lastTime = 0;
            $scope.cumulativeTime = 0;

            // Scope Functions
            $scope.generateGrid = function () {
                var de;
                $scope.gridObj.grid = [];
                for (var y = 0; y < $scope.box.height / $scope.gridObj.tileSize; y++) {
                    var arr = [];
                    for (var x = 0; x < $scope.box.width / $scope.gridObj.tileSize; x++) {
                        de = MathUtils.getRandomNumber(0, 1) < 0.1;
                        // DEBUG
                        de ? console.log('ALIVE') : '';
                        arr.push((new LifeCell({
                            box: {
                                x: x * $scope.gridObj.tileSize,
                                y: y * $scope.gridObj.tileSize,
                                width: $scope.gridObj.tileSize,
                                height: $scope.gridObj.tileSize
                            },
                            status: de ? LifeCell.ALIVE : LifeCell.DEAD,
                            DEAD_COLOR: $scope.BACK_COLOR
                        })));
                    }
                    $scope.gridObj.grid.push(arr);
                }
                Utils.fillNeighbors($scope.gridObj.grid);
            };

            $scope.nextGeneration = function () {
                $scope.generation++;
                var copy = LifeCell.deepCopyGrid($scope.gridObj.grid);
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