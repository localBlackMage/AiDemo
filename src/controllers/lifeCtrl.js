(function (ng) {
    'use strict';

    ng.module('aidemo.life', [
        'ui.router',
        'aidemo.service.utils',
        'aidemo.service.mathUtils',
        'aidemo.service.drawUtils',
        'aidemo.service.gridService',
        'aidemo.service.screenSize',
        'aidemo.models.lifeCell'
    ])
        .controller('LifeController', ['$scope', 'Utils', 'MathUtils', 'DrawUtils', 'GridService', 'ScreenSize', 'LifeCell',
            function ($scope, Utils, MathUtils, DrawUtils, GridService, ScreenSize, LifeCell) {
                var vm = this;
                vm.BACK_COLOR = "#555555";
                vm.GRID_COLOR = "#8EAEC9";
                vm.generation = 0;
                vm.step = 1;
                vm.pause = true;
                vm.gridObj = {
                    grid: [],
                    tileSize: 10
                };
                vm.lastTime = 0;
                vm.cumulativeTime = 0;

                var viewport = ScreenSize.getViewPort();
                vm.viewport = {
                    height: (viewport.height / 1.5) - (viewport.height % vm.gridObj.tileSize),
                    width: (viewport.width / 2.0) - (viewport.width % vm.gridObj.tileSize)
                };

                vm.generateGridColumns = function (numberOfColumns, row) {
                    var currentRow = [];
                    for (var col = 0; col < numberOfColumns; col++) {
                        var alive = MathUtils.getRandomNumber(0, 1) <= 0.1;
                        currentRow.push((new LifeCell({
                            box: {
                                x: col * vm.gridObj.tileSize,
                                y: row * vm.gridObj.tileSize,
                                width: vm.gridObj.tileSize,
                                height: vm.gridObj.tileSize
                            },
                            status: alive ? LifeCell.ALIVE : LifeCell.DEAD,
                            DEAD_COLOR: vm.BACK_COLOR
                        })));
                    }
                    return currentRow;
                };

                vm.generateGrid = function () {
                    var numberOfRows = vm.box.height / vm.gridObj.tileSize,
                        numberOfColumns = vm.box.width / vm.gridObj.tileSize;
                    vm.gridObj.grid = [];
                    for (var row = 0; row < numberOfRows; row++) {
                        var currentRow = vm.generateGridColumns(numberOfColumns, row);
                        vm.gridObj.grid.push(currentRow);
                    }
                    GridService.fillGridNeighbors(vm.gridObj.grid, false);
                };

                vm.nextGeneration = function () {
                    vm.generation++;
                    var copy = GridService.deepCopyGrid(vm.gridObj.grid, LifeCell, false);
                    for (var y = 0; y < vm.gridObj.grid.length; y++) {
                        for (var x = 0; x < vm.gridObj.grid[y].length; x++) {
                            vm.gridObj.grid[y][x].setStatus(copy[y][x].update());
                        }
                    }
                    $scope.$apply();
                };

                vm.update = function () {
                    if (!vm.pause) {
                        var currTime = new Date().getTime();
                        vm.cumulativeTime += (currTime - vm.lastTime) / 1000;
                        vm.lastTime = currTime;

                        if (vm.cumulativeTime > vm.step) {
                            vm.nextGeneration();
                            vm.cumulativeTime = 0;
                        }
                    }
                };

                vm.reset = function () {
                    vm.generateGrid();
                    vm.generation = 0;
                };

                vm.pauseToggle = function () {
                    vm.pause = !vm.pause;

                    if (vm.gridObj.grid.length === 0) {
                        vm.generateGrid();
                    }
                };

                vm.spawnCell = function (x, y) {
                    var newX = Math.max(Math.round(x / vm.gridObj.tileSize) - 1, 0),
                        newY = Math.max(Math.round(y / vm.gridObj.tileSize) - 1, 0);
                    vm.gridObj.grid[newY][newX].setStatus(LifeCell.ALIVE);
                };

                vm.touch = function (event) {
                    if (vm.gridObj.grid.length === 0) {
                        return;
                    }
                    var x = event.offsetX - 1,
                        y = event.offsetY - 1;

                    vm.spawnCell(x, y);
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
                            controller: 'LifeController',
                            controllerAs: 'lifeCtrl'
                        }
                    }
                });
        }]);

}(angular));