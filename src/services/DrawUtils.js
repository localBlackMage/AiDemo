(function (ng) {
    'use strict';
    ng.module('aidemo.service.drawUtils', [
        'aidemo.service.utils'
    ])
        .service('DrawUtils', ['Utils',
            function (Utils) {
                var service = this;
                service.defaultFont = "12px Verdana";
                service.clearCanvas = function (canvas) {
                    canvas.getContext('2d').clearRect(0, 0, canvas.width + 1, canvas.height + 1);
                };
                service.fillCanvas = function (canvas, color) {
                    canvas.getContext('2d').fillStyle = color;
                    canvas.getContext('2d').fillRect(0, 0, canvas.width + 1, canvas.height + 1);
                };
                service.drawCircle = function (ctx, x, y, r, c) {
                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
                    ctx.fillStyle = c;
                    ctx.fill();
                    ctx.strokeStyle = c;
                    ctx.stroke();
                    ctx.closePath();
                };
                service.drawRing = function (ctx, x, y, r, c) {
                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
                    ctx.strokeStyle = c;
                    ctx.stroke();
                    ctx.closePath();
                };
                service.drawSquare = function (ctx, box, color) {
                    ctx.fillStyle = color;
                    ctx.fillRect(box.x, box.y, box.width, box.height);
                };
                service.drawLine = function (ctx, sX, sY, eX, eY, c) {
                    ctx.beginPath();
                    ctx.moveTo(sX, sY);
                    ctx.lineTo(eX, eY);
                    ctx.strokeStyle = c;
                    ctx.stroke();
                    ctx.closePath();
                };
                service.drawGrid = function (ctx, box, spacing, color) {
                    for (var y = 0; y < box.height; y += spacing) {
                        service.drawLine(ctx, 0, y, box.width, y, color);
                    }
                    for (var x = 0; x < box.width; x += spacing) {
                        service.drawLine(ctx, x, 0, x, box.height, color);
                    }
                    service.drawLine(ctx, box.width - 1, 0, box.width - 1, box.height, color);
                    service.drawLine(ctx, 0, box.height - 1, box.width, box.height - 1, color);
                };
                service.drawExclamation = function (ctx, x, y, c) {
                    service.drawLine(ctx, x, y, x, y - 1, c);
                    service.drawLine(ctx, x, y - 3, x, y - 13, c);
                };
                service.drawText = function (ctx, x, y, c, s) {
                    ctx.font = service.defaultFont;
                    ctx.fillStyle = c;
                    ctx.fillText(s, x, y);
                };
                service.drawImage = function (ctx, x, y, img) {
                    ctx.drawImage(img, x, y);
                };
                /**
                 * Draws a sprite from a sprite sheet
                 * @param ctx - Canvas element's context property
                 * @param img - Image, spriteSheet
                 * @param sX - x offset into the spriteSheet
                 * @param sY - y offset into the spriteSheet
                 * @param sW - width of the sprite
                 * @param sH - height of the sprite
                 * @param dX - x coordinate to draw the sprite at
                 * @param dY - y coordinate to draw the sprite at
                 * @param dW - width to draw the sprite at
                 * @param dH - height to draw the sprite at
                 */
                service.drawSprite = function (ctx, img, sX, sY, sW, sH, dX, dY, dW, dH) {
                    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
                };
                service.getColorValueForHex = function(value) {
                    value = !_.isNumber(value) && value ? value.toUpperCase() : value;
                    var hexColors = {
                        A: 10,
                        B: 11,
                        C: 12,
                        D: 13,
                        E: 14,
                        F: 15
                    };
                    return hexColors[value] || value;
                };
                service.getHexValueForColor = function(value) {
                    var hexColors = {
                        "10": "A",
                        "11": "B",
                        "12": "C",
                        "13": "D",
                        "14": "E",
                        "15": "F"
                    };
                    return hexColors[value] || value;
                };
                service.isValueAcceptableHexValue = function(value) {
                    return _.isNumber(value) && value >= 0 && value <= 15;
                };
                service.convertValueToHexOrMinimum = function (value, minimum) {
                    value = service.getColorValueForHex(value);
                    return service.isValueAcceptableHexValue(value) ? value : minimum;
                };
                service.getRandomColor = function () {
                    var letters = '0123456789ABCDEF'.split('');
                    var color = '#';
                    for (var i = 0; i < 6; i++) {
                        color += letters[Math.floor(Math.random() * 16)];
                    }
                    return color;
                };
                service.getRandomGreen = function (min) {
                    var color = service.getRandomColor().split('');
                    min = service.getColorValueForHex(min);
                    min = _.isNumber(min) ? min : 5;
                    color[1] = color[2] = color[5] = color[6] = "0";
                    color[3] = Utils.isGreaterThanOrNaN(color[3], min) ? color[3] : service.getHexValueForColor(min);
                    color[4] = Utils.isGreaterThanOrNaN(color[4], min) ? color[4] : service.getHexValueForColor(min);
                    return color.join('');
                };
                service.getRandomRed = function (min) {
                    var color = service.getRandomColor().split('');
                    min = service.getColorValueForHex(min);
                    min = _.isNumber(min) ? min : 5;
                    color[3] = color[4] = color[5] = color[6] = "0";
                    color[1] = Utils.isGreaterThanOrNaN(color[1], min) ? color[1] : service.getHexValueForColor(min);
                    color[2] = Utils.isGreaterThanOrNaN(color[2], min) ? color[2] : service.getHexValueForColor(min);
                    return color.join('');
                };
                service.getRandomBlue = function (min) {
                    var color = service.getRandomColor().split('');
                    min = service.getColorValueForHex(min);
                    min = _.isNumber(min) ? min : 5;
                    color[1] = color[2] = color[3] = color[4] = "0";
                    color[5] = Utils.isGreaterThanOrNaN(color[5], min) ? color[5] : service.getHexValueForColor(min);
                    color[6] = Utils.isGreaterThanOrNaN(color[6], min) ? color[6] : service.getHexValueForColor(min);
                    return color.join('');
                };
            }
        ]);
})(angular);