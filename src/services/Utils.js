(function (ng) {
    'use strict';
    ng.module('aidemo.service.utils', [
    ])
        .factory('Utils', [
            function () {
                var isNotNullOrUndefined = function (obj) {
                    return _.isUndefined(obj) || _.isNull(obj);
                };

                var isGreaterThanOrNaN = function (obj, min) {
                    return parseInt(obj, 10) > min || _.isNaN(parseInt(obj, 10));
                };

                var getNeighbors = function (x, y, xLen, yLen, grid, udlrOnly) {
                    udlrOnly = udlrOnly === true || udlrOnly === false ? udlrOnly : false;
                    var neighbors = [];
                    neighbors.push(x - 1 >= 0 ? grid[y][x - 1] : null); // 0, -1
                    neighbors.push(x + 1 < xLen ? grid[y][x + 1] : null); // 0, 1
                    neighbors.push(y - 1 >= 0 ? grid[y - 1][x] : null); // -1, 0
                    neighbors.push(y + 1 < yLen ? grid[y + 1][x] : null); // 1, 0

                    if (!udlrOnly) {
                        neighbors.push(x - 1 >= 0 && y - 1 >= 0 ? grid[y - 1][x - 1] : null); // -1, -1
                        neighbors.push(x - 1 >= 0 && y + 1 < yLen ? grid[y + 1][x - 1] : null); // 1, -1
                        neighbors.push(x + 1 < xLen && y - 1 >= 0 ? grid[y - 1][x + 1] : null); // -1, 1
                        neighbors.push(x + 1 < xLen && y + 1 < yLen ? grid[y + 1][x + 1] : null); // 1, 1
                    }


                    return neighbors.filter(isNotNullOrUndefined);
                };

                var fillNeighbors = function (grid, udlrOnly) {
                    udlrOnly = udlrOnly === true || udlrOnly === false ? udlrOnly : false;
                    var yLen = grid.length,
                        xLen = grid[0].length;
                    for (var y = 0; y < grid.length; y++) {
                        for (var x = 0; x < grid[y].length; x++) {
                            if (grid[y][x]) {
                                grid[y][x].fillNeighbors(getNeighbors(x, y, xLen, yLen, grid, udlrOnly));
                            }
                        }
                    }
                    return grid;
                };

                return {
                    isNotNullOrUndefined: isNotNullOrUndefined,
                    isGreaterThanOrNaN: isGreaterThanOrNaN,
                    getNeighbors: getNeighbors,
                    fillNeighbors: fillNeighbors
                };
            }
        ]);
})(angular);