(function (ng) {
    'use strict';

    ng.module('aidemo.chip', [
        'ui.router',
        'aidemo.service.gridService',
        'aidemo.service.mathUtils',
        'aidemo.service.drawUtils',
        'aidemo.models.vector',
        'aidemo.models.chip.globals',
        'aidemo.models.chip.player',
        'aidemo.models.chip.item',
        'aidemo.models.chip.tile'
    ])
        .controller("ChipController", ['$rootScope', '$scope', 'GridService', 'MathUtils', 'DrawUtils', 'Vector', 'Globals', 'Player', 'Item', 'Tile',
            function ($rootScope, $scope, GridService, MathUtils, DrawUtils, Vector, Globals, Player, Item, Tile) {
                var vm = this;
                vm.BACK_COLOR = "#555555";
                vm.GRID_COLOR = "#8EAEC9";

                // Common Objects/Definitions
                var toBePlaced = [
                    Item.FLIPPERS,
                    Item.FIRE_BOOTS,
                    Item.ROLLER_SKATES,
                    Item.ICE_SKATES,
                    Item.BLUE_KEY,
                    Item.RED_KEY,
                    Item.YELLOW_KEY,
                    Item.GREEN_KEY
                ];

                // Private Methods
                vm._handleChipDoor = function (dirTile) {
                    if (vm.gameStats.chipsRemaining !== 0) {
                        return false;
                    }
                    else {
                        dirTile.removeObstacle();
                        return true;
                    }
                };
                vm._handleDoor = function (dirTile) {
                    var key = dirTile.getObstacle().doorToKey();
                    if (vm.player.specialSlots[key] === null) {
                        return false;
                    }
                    else {
                        dirTile.removeObstacle();
                        vm.player.removeItem(key);
                        return true;
                    }
                };
                vm._handlePushBlock = function (dirTile, nDirTile) {
                    if (nDirTile.getType() === Tile.WATER) {
                        dirTile.removeObstacle();
                        nDirTile.setType(Tile.WATER_BLOCK);
                        return true;
                    }
                    else if (nDirTile.getType() === Tile.EMPTY &&
                        nDirTile.getItem() === null &&
                        nDirTile.getObstacle() === null) {
                        nDirTile.setObstacle(dirTile.getObstacle());
                        dirTile.removeObstacle();
                        return true;
                    }
                    else {
                        return false;
                    }
                };

                vm._handleObstacle = function (dirTile, direction) {
                    var nDirTile = dirTile.getNeighborTileInDirection(direction);
                    if (dirTile.getType() === BLOCK) {
                        return false;
                    }
                    if (dirTile.getObstacle() !== null) {
                        var obstacle = dirTile.getObstacle();
                        if (obstacle.getType() === Obstacle.CHIP_DOOR) {
                            return vm._handleChipDoor(dirTile);
                        }
                        if (obstacle.isColoredDoor()) {
                            return vm._handleDoor(dirTile);
                        }
                        if (obstacle.getType() === Obstacle.PUSH_BLOCK) {
                            return vm._handlePushBlock(dirTile, nDirTile);
                        }
                    }
                    return true;
                };
                vm._bounds = function (x, y, lower, upper) {
                    return ((x === lower && (y >= lower && y <= upper)) ||
                    (x === upper && (y >= lower && y <= upper)) ||
                    (y === lower && (x >= lower && x <= upper)) ||
                    (y === upper && (x >= lower && x <= upper)));
                };
                vm._withinBounds = function (x, y, lower, upper) {
                    return (x > lower && x < upper && y > lower && y < upper);
                };
                vm._getType = function (inBounds) {
                    if (!inBounds) {
                        return Tile.Tile.EMPTY;
                    }
                    if (MathUtils.getRandomNumber(0, 1) < 0.075) {

                        if (MathUtils.getRandomNumber(0, 1) < 0.5) {
                            return Tile.WATER;
                        }
                        else {
                            return Tile.FIRE;
                        }
                    }
                    else {
                        if (MathUtils.getRandomNumber(0, 1) < 0.1) {
                            return Tile.WATER_BLOCK;
                        }
                        else {
                            return Tile.Tile.EMPTY;
                        }
                    }
                };
                vm._fillTile = function (x, y) {
                    var type, item = null;

                    if (vm._bounds(x, y, vm.world.lower, vm.world.upper)) {
                        type = Tile.BLOCK;
                    }
                    else if (x === vm.world.upper - 1 && y === vm.world.upper - 1) {
                        type = Tile.EXIT;
                    }
                    else {
                        var inBounds = vm._withinBounds(x, y, vm.world.lower, vm.world.upper);
                        type = vm._getType(inBounds);
                        if (type === Tile.Tile.EMPTY && inBounds) {
                            if (toBePlaced.length !== 0 && MathUtils.getRandomNumber(0, 1) < 0.1) {
                                item = new Item({type: toBePlaced.pop()});
                            }
                            else if (MathUtils.getRandomNumber(0, 1) < 0.05) {
                                vm.gameStats.chipsRemaining++;
                                item = new Item({type: Item.MICRO_CHIP});
                            }
                        }
                    }

                    return new Tile({
                        screenPos: new Vector({x: x * Globals.TILE_SIZE, y: y * Globals.TILE_SIZE}),
                        worldPos: new Vector({x: x * Globals.TILE_SIZE, y: y * Globals.TILE_SIZE}),
                        type: type,
                        item: item
                    });
                };

                // Scope Fields
                vm.box = {};
                //vm.itemCtx = $('#itemCanvas')[0].getContext('2d'); // TODO: FIX
                vm.gameStats = {
                    level: 1,
                    timeRemaining: 0,
                    chipsRemaining: 0
                };
                vm.presetWorld = {
                    grid: [],
                    x: 20, y: 20,
                    tileSize: Globals.TILE_SIZE,
                    lower: 3, upper: 16
                };
                var screenXY = vm.presetWorld.tileSize * 4,
                    worldXY = vm.presetWorld.tileSize * 4;
                vm.player = new Player({
                    screenPos: new Vector({x: screenXY, y: screenXY}),
                    worldPos: new Vector({x: worldXY, y: worldXY})
                });

                // Public Functions

                $rootScope.$on('keypress', function (e, a, key) {
                    $scope.$apply(function () {
                        vm.handleKeyPress(key);
                    });
                });

                vm.handleKeyPress = function (keyEvent) {
                    if (vm.player.getStatus() === Globals.ALIVE) {
                        if (keyEvent === 's'){
                            vm.moveAll(Globals.DOWN);
                        }
                        else if (keyEvent === 'a'){
                            vm.moveAll(Globals.LEFT);
                        }
                        else if (keyEvent === 'w'){
                            vm.moveAll(Globals.UP);
                        }
                        else if (keyEvent === 'd') {
                            vm.moveAll(Globals.RIGHT);
                        }

                        // DEBUG KEYS
                        if (keyEvent === 'p') {
                            vm.world.grid[8][8].setObstacle(new Obstacle({type: Obstacle.PUSH_BLOCK}));
                        }
                    }
                };

                vm.moveAll = function (direction) {
                    var dirIndex = direction.divNew(Globals.TILE_SIZE).addNew(vm.player.getTileIndex()),
                        dirTile = vm.world.grid[dirIndex.y][dirIndex.x];

                    if (vm._handleObstacle(dirTile, direction)) {
                        vm.player.move(direction);
                        vm.moveWorld(direction.mulNew(-1));

                        vm.grabMicrochip(dirTile);

                        vm.player.handleTile(dirTile);
                    }
                };

                vm.moveWorld = function (dir) {
                    for (var y = 0; y < vm.world.grid.length; y++) {
                        for (var x = 0; x < vm.world.grid[y].length; x++) {
                            vm.world.grid[y][x].move(dir);
                        }
                    }
                };

                vm.grabMicrochip = function (tile) {
                    var item = tile.getItem();
                    if (item !== null && item.getType() === Item.MICRO_CHIP) {
                        vm.gameStats.chipsRemaining--;
                    }
                };

                vm.generateWorld = (function () {
                    vm.world = vm.presetWorld;
                    for (var y = 0; y < vm.world.x; y++) {
                        var arr = [];
                        for (var x = 0; x < vm.world.y; x++) {
                            arr.push(vm._fillTile(x, y));
                        }
                        vm.world.grid.push(arr);
                    }
                    // DEBUG
                    var upper = vm.world.upper;
                    vm.world.grid[upper - 1][upper - 3].setObstacle(new Obstacle({type: Obstacle.RED_DOOR}));
                    vm.world.grid[upper - 1][upper - 4].setObstacle(new Obstacle({type: Obstacle.BLUE_DOOR}));
                    vm.world.grid[upper - 1][upper - 5].setObstacle(new Obstacle({type: Obstacle.GREEN_DOOR}));
                    vm.world.grid[upper - 1][upper - 6].setObstacle(new Obstacle({type: Obstacle.YELLOW_DOOR}));

                    vm.world.grid[upper - 1][upper - 2].setObstacle(new Obstacle({type: Obstacle.CHIP_DOOR}));
                    vm.world.grid[upper - 2][upper - 2].setObstacle(new Obstacle({type: Obstacle.CHIP_DOOR}));
                    vm.world.grid[upper - 2][upper - 1].setObstacle(new Obstacle({type: Obstacle.CHIP_DOOR}));


                    GridService.fillNeighbors(vm.world.grid, true);
                })();
            }
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                .state('app.chip', {
                    url: 'chip',

                    resolve: {},

                    views: {
                        'main@': {
                            templateUrl: 'chipsChallenge.html',
                            controller: 'ChipController',
                            controllerAs: 'chipCtrl'
                        }
                    }
                });
        }]);
}(angular));