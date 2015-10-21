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

(function (ng) {
    'use strict';
    ng.module('aidemo.service.mathUtils', [])
        .factory('MathUtils', [
            function () {
                var getRand = function (min, max) {
                    return Math.random() * (max - min) + min;
                };

                var getNearest = function (array, origin, tolerance) {
                    var retArray = [],
                        self = this;
                    array.forEach(function (item) {
                        if (self.distance(origin.pos, item.pos) <= tolerance && origin.pos != item.pos && origin !== item) {
                            retArray.push(item);
                        }
                    });
                    return retArray;
                };

                return {
                    getRand: getRand,
                    getNearest: getNearest
                };
            }
        ]);
})(angular);

(function (ng) {
    'use strict';
    ng.module('aidemo.service.drawUtils', [
        'aidemo.service.utils'
    ])
        .factory('DrawUtils', ['Utils',
            function (Utils) {
                var defaultFont = "12px Verdana";
                var clearCanvas = function (canvas) {
                    canvas.getContext('2d').clearRect(0, 0, canvas.width + 1, canvas.height + 1);
                };
                var fillCanvas = function (canvas, color) {
                    canvas.getContext('2d').fillStyle = color;
                    canvas.getContext('2d').fillRect(0, 0, canvas.width + 1, canvas.height + 1);
                };
                var drawCircle = function (ctx, x, y, r, c) {
                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
                    ctx.fillStyle = c;
                    ctx.fill();
                    ctx.strokeStyle = c;
                    ctx.stroke();
                    ctx.closePath();
                };
                var drawRing = function (ctx, x, y, r, c) {
                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
                    ctx.strokeStyle = c;
                    ctx.stroke();
                    ctx.closePath();
                };
                var drawSquare = function (ctx, box, color) {
                    ctx.fillStyle = color;
                    ctx.fillRect(box.x, box.y, box.width, box.height);
                };
                var drawLine = function (ctx, sX, sY, eX, eY, c) {
                    ctx.beginPath();
                    ctx.moveTo(sX, sY);
                    ctx.lineTo(eX, eY);
                    ctx.strokeStyle = c;
                    ctx.stroke();
                    ctx.closePath();
                };
                var drawGrid = function (ctx, box, spacing, color) {
                    for (var y = 0; y < box.height; y += spacing) {
                        drawLine(ctx, 0, y, box.width, y, color);
                    }
                    for (var x = 0; x < box.width; x += spacing) {
                        drawLine(ctx, x, 0, x, box.height, color);
                    }
                };
                var drawExclamation = function (ctx, x, y, c) {
                    drawLine(ctx, x, y, x, y - 1, c);
                    drawLine(ctx, x, y - 3, x, y - 13, c);
                };
                var drawText = function (ctx, x, y, c, s) {
                    ctx.font = defaultFont;
                    ctx.fillStyle = c;
                    ctx.fillText(s, x, y);
                };
                var getRandomColor = function () {
                    var letters = '0123456789ABCDEF'.split('');
                    var color = '#';
                    for (var i = 0; i < 6; i++) {
                        color += letters[Math.floor(Math.random() * 16)];
                    }
                    return color;
                };
                var getRandomGreen = function () {
                    var color = getRandomColor().split(''), min = 5;
                    color[1] = color[2] = color[5] = color[6] = "0";
                    color[3] = Utils.isGreaterThanOrNaN(color[3], min) ? color[3] : min.toString();
                    color[4] = Utils.isGreaterThanOrNaN(color[4], min) ? color[4] : min.toString();
                    return color.join('');
                };
                var getRandomRed = function () {
                    var color = getRandomColor().split(''), min = 5;
                    color[3] = color[4] = color[5] = color[6] = "0";
                    color[1] = Utils.isGreaterThanOrNaN(color[1], min) ? color[1] : min.toString();
                    color[2] = Utils.isGreaterThanOrNaN(color[2], min) ? color[2] : min.toString();
                    return color.join('');
                };
                var getRandomBlue = function () {
                    var color = getRandomColor().split(''), min = 5;
                    color[1] = color[2] = color[3] = color[4] = "0";
                    color[1] = Utils.isGreaterThanOrNaN(color[5], min) ? color[5] : min.toString();
                    color[2] = Utils.isGreaterThanOrNaN(color[6], min) ? color[6] : min.toString();
                    return color.join('');
                };

                return {
                    clearCanvas: clearCanvas,
                    fillCanvas: fillCanvas,
                    drawCircle: drawCircle,
                    drawRing: drawRing,
                    drawSquare: drawSquare,
                    drawLine: drawLine,
                    drawGrid: drawGrid,
                    drawExclamation: drawExclamation,
                    drawText: drawText,
                    getRandomColor: getRandomColor,
                    getRandomGreen: getRandomGreen,
                    getRandomRed: getRandomRed,
                    getRandomBlue: getRandomBlue
                };
            }
        ]);
})(angular);