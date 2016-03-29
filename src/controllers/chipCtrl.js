(function (ng) {
    'use strict';

    ng.module('aidemo.chip', [
        'ui.router',
        'aidemo.service.mathUtils',
        'aidemo.service.drawUtils',
        'aidemo.models.vector',
        'aidemo.models.chip.player',
        'aidemo.models.chip.item',
        'aidemo.models.chip.tile'
    ])
        .controller("ChipController", ['MathUtils', 'DrawUtils', 'Vector', 'Player', 'Item', 'Tile',
            function (MathUtils, DrawUtils, Vector, Player, Item, Tile) {
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
                var handleChipDoor = function (dirTile) {
                    if (vm.gameStats.chipsRemaining !== 0) {
                        return false;
                    }
                    else {
                        dirTile.removeObstacle();
                        return true;
                    }
                };
                var handleDoor = function (dirTile) {
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
                var handlePushBlock = function (dirTile, nDirTile) {
                    if (nDirTile.getType() === Tile.WATER) {
                        dirTile.removeObstacle();
                        nDirTile.setType(Tile.WATER_BLOCK);
                        return true;
                    }
                    else if (nDirTile.getType() === EMPTY &&
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

                var handleObstacle = function (dirTile, direction) {
                    var nDirTile = dirTile.getNeighborInDir(direction);
                    if (dirTile.getType() === BLOCK) {
                        return false;
                    }
                    if (dirTile.getObstacle() !== null) {
                        var obstacle = dirTile.getObstacle();
                        if (obstacle.getType() === CHIPDOOR) {
                            return handleChipDoor(dirTile);
                        }
                        if (obstacle.isDoor()) {
                            return handleDoor(dirTile);
                        }
                        if (obstacle.getType() === PUSHBLOCK) {
                            return handlePushBlock(dirTile, nDirTile);
                        }
                    }
                    return true;
                };
                var bounds = function (x, y, lower, upper) {
                    return ((x === lower && (y >= lower && y <= upper)) ||
                    (x === upper && (y >= lower && y <= upper)) ||
                    (y === lower && (x >= lower && x <= upper)) ||
                    (y === upper && (x >= lower && x <= upper)));
                };
                var withinBounds = function (x, y, lower, upper) {
                    return (x > lower && x < upper && y > lower && y < upper);
                };
                var getType = function (inBounds) {
                    if (!inBounds) {
                        return Tile.EMPTY;
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
                            return Tile.EMPTY;
                        }
                    }
                };
                var fillTile = function (x, y) {
                    var type, item = null;

                    if (bounds(x, y, vm.world.lower, vm.world.upper)) {
                        type = Tile.BLOCK;
                    }
                    else if (x === vm.world.upper - 1 && y === vm.world.upper - 1) {
                        type = Tile.EXIT;
                    }
                    else {
                        var inBounds = withinBounds(x, y, vm.world.lower, vm.world.upper);
                        type = getType(inBounds);
                        if (type === Tile.EMPTY && inBounds) {
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
                        screenPos: new Vector({x: x * 64, y: y * 64}),
                        worldPos: new Vector({x: x * 64, y: y * 64}),
                        type: type,
                        item: item
                    });
                };

                // Scope Fields
                vm.canvas = $('#gameCanvas')[0];
                vm.box = {
                    width: vm.canvas.width,
                    height: vm.canvas.height,
                    center: new Vector ({x: vm.canvas.width / 2, y: vm.canvas.height / 2})
                };
                vm.ctx = vm.canvas.getContext('2d');


                vm.itemCtx = $('#itemCanvas')[0].getContext('2d');
                vm.gameStats = {
                    level: 1,
                    timeRemaining: 0,
                    chipsRemaining: 0
                };
                vm.presetWorld = {
                    grid: [],
                    x: 20, y: 20,
                    tileSize: 64,
                    lower: 3, upper: 16
                };
                var sxy = vm.presetWorld.tileSize * 4,
                    wxy = vm.presetWorld.tileSize * 4;
                vm.player = new Chip({
                    screenPos: new Vector({x: sxy, y: sxy}),
                    worldPos: new Vector({x: wxy, y: wxy})
                });

                // Scope Functions
                vm.toHome = function () {
                    NavService.NavToHome();
                };

                $rootScope.$on('keypress', function (e, a, key) {
                    $scope.$apply(function () {
                        vm.handleKeyPress(key);
                    });
                });

                vm.handleKeyPress = function (keyEvent) {
                    if (vm.player.getStatus() === ALIVE) {
                        if (keyEvent === 's')
                            vm.moveAll(DOWN);
                        else if (keyEvent === 'a')
                            vm.moveAll(LEFT);
                        else if (keyEvent === 'w')
                            vm.moveAll(UP);
                        else if (keyEvent === 'd')
                            vm.moveAll(RIGHT);

                        // DEBUG KEYS
                        if (keyEvent === 'p') {
                            vm.world.grid[8][8].setObstacle(new Obstacle({type: PUSHBLOCK}));
                        }
                    }
                };

                vm.moveAll = function (direction) {
                    var dirIndex = direction.divNew(64).addNew(vm.player.getIndex()),
                        dirTile = vm.world.grid[dirIndex.y][dirIndex.x];

                    if (handleObstacle(dirTile, direction)) {
                        vm.player.move(direction);
                        vm.moveWorld(direction.mulnew -1));

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
                    if (item !== null && item.getType() === MICROCHIP) {
                        vm.gameStats.chipsRemaining--;
                    }
                };

                vm.generateWorld = (function () {
                    vm.world = vm.presetWorld;
                    for (var y = 0; y < vm.world.x; y++) {
                        var arr = [];
                        for (var x = 0; x < vm.world.y; x++) {
                            arr.push(fillTile(x, y));
                        }
                        vm.world.grid.push(arr);
                    }
                    // DEBUG
                    var upper = vm.world.upper;
                    vm.world.grid[upper - 1][upper - 3].setObstacle(new Obstacle({type: REDDOOR}));
                    vm.world.grid[upper - 1][upper - 4].setObstacle(new Obstacle({type: BLUEDOOR}));
                    vm.world.grid[upper - 1][upper - 5].setObstacle(new Obstacle({type: GREENDOOR}));
                    vm.world.grid[upper - 1][upper - 6].setObstacle(new Obstacle({type: YELLOWDOOR}));

                    vm.world.grid[upper - 1][upper - 2].setObstacle(new Obstacle({type: CHIPDOOR}));
                    vm.world.grid[upper - 2][upper - 2].setObstacle(new Obstacle({type: CHIPDOOR}));
                    vm.world.grid[upper - 2][upper - 1].setObstacle(new Obstacle({type: CHIPDOOR}));


                    fillNeighbors(vm.world.grid, true);
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
                            templateUrl: 'chip.html',
                            controller: 'ChipController',
                            controllerAs: 'ChipCtrl'
                        }
                    }
                });
        }]);
}(angular));