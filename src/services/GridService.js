(function (ng) {
    'use strict';
    ng.module('aidemo.service.gridService', [
        'aidemo.service.utils'
    ])
        .service('GridService', ['$log', 'Utils',
            function ($log, Utils) {
                var service = this;

                service.getNeighborsForCoordinates = function (x, y, grid, noDiagonal) {
                    noDiagonal = _.isBoolean(noDiagonal) ? noDiagonal : false;
                    var neighbors = [],
                        yLen = grid.length,
                        xLen = grid[0].length;
                    neighbors.push(x - 1 >= 0 ? grid[y][x - 1] : null); // 0, -1
                    neighbors.push(x + 1 < xLen ? grid[y][x + 1] : null); // 0, 1
                    neighbors.push(y - 1 >= 0 ? grid[y - 1][x] : null); // -1, 0
                    neighbors.push(y + 1 < yLen ? grid[y + 1][x] : null); // 1, 0

                    if (!noDiagonal) {
                        neighbors.push(x - 1 >= 0 && y - 1 >= 0 ? grid[y - 1][x - 1] : null); // -1, -1
                        neighbors.push(x - 1 >= 0 && y + 1 < yLen ? grid[y + 1][x - 1] : null); // 1, -1
                        neighbors.push(x + 1 < xLen && y - 1 >= 0 ? grid[y - 1][x + 1] : null); // -1, 1
                        neighbors.push(x + 1 < xLen && y + 1 < yLen ? grid[y + 1][x + 1] : null); // 1, 1
                    }
                    return neighbors.filter(function (neighbor) {
                        return !Utils.isNullOrUndefined(neighbor);
                    });
                };

                service.fillGridNeighbors = function (grid, noDiagonal) {
                    noDiagonal = _.isBoolean(noDiagonal) ? noDiagonal : false;
                    for (var y = 0; y < grid.length; y++) {
                        for (var x = 0; x < grid[y].length; x++) {
                            if (grid[y][x] && _.isFunction(grid[y][x].fillNeighbors)) {
                                grid[y][x].fillNeighbors(service.getNeighborsForCoordinates(x, y, grid, noDiagonal));
                            }
                        }
                    }
                    return grid;
                };

                service.deepCopyGrid = function (grid, GridObjectType, noDiagonal) {
                    if (!_.isFunction(GridObjectType)) {
                        $log.error("gridObjectType MUST be a function!");
                        $log.log(GridObjectType);
                        return;
                    }
                    noDiagonal = _.isBoolean(noDiagonal) ? noDiagonal : false;
                    var gridCopy = [];
                    grid.forEach(function(row) {
                        var currentRow = [];
                        row.forEach(function(node){
                            if (node) {
                                currentRow.push(new GridObjectType({
                                    box: node.box,
                                    status: node.status
                                }));
                            }
                        });
                        gridCopy.push(currentRow);
                    });
                    return service.fillGridNeighbors(gridCopy, noDiagonal);
                };
            }
        ]);
})(angular);