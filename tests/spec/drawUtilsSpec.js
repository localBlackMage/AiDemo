describe("DrawUtils Service", function () {
    var DrawUtils, Utils, canvas, context, letters = '0123456789ABCDEF';


    beforeEach(function () {
        module('aidemo.service.drawUtils', 'aidemo.service.utils');

        inject(function (_DrawUtils_, _Utils_) {
            DrawUtils = _DrawUtils_;
            Utils = _Utils_;

            canvas = document.createElement("canvas");
            canvas.height = 100;
            canvas.width = 100;
            context = canvas.getContext("2d")
        });
    });

    it("should clear a canvas", function () {
        spyOn(context, 'clearRect');

        DrawUtils.clearCanvas(canvas);

        expect(context.clearRect.calls.count()).toEqual(1);
        expect(context.clearRect).toHaveBeenCalledWith(0, 0, canvas.width + 1, canvas.height + 1);
    });

    it("should fill a canvas", function () {
        var color = "#CCCCCC";
        spyOn(context, 'fillRect');

        DrawUtils.fillCanvas(canvas, color);

        expect(context.fillStyle.toLowerCase()).toEqual(color.toLowerCase());
        expect(context.fillRect.calls.count()).toEqual(1);
        expect(context.fillRect).toHaveBeenCalledWith(0, 0, canvas.width + 1, canvas.height + 1);
    });

    it("should draw a circle on the canvas", function () {
        var x = 10, y = 10, radius = 5, color = "#CCCCCC";
        spyOn(context, 'beginPath');
        spyOn(context, 'arc');
        spyOn(context, 'fill');
        spyOn(context, 'stroke');
        spyOn(context, 'closePath');

        DrawUtils.drawCircle(context, x, y, radius, color);

        expect(context.fillStyle.toLowerCase()).toEqual(color.toLowerCase());
        expect(context.strokeStyle.toLowerCase()).toEqual(color.toLowerCase());
        expect(context.beginPath.calls.count()).toEqual(1);
        expect(context.arc.calls.count()).toEqual(1);
        expect(context.arc).toHaveBeenCalledWith(x, y, radius, 0, 2 * Math.PI, false);
        expect(context.fill.calls.count()).toEqual(1);
        expect(context.stroke.calls.count()).toEqual(1);
        expect(context.closePath.calls.count()).toEqual(1);
    });

    it("should draw a ring on the canvas", function () {
        var x = 10, y = 10, radius = 5, color = "#CCCCCC";
        spyOn(context, 'beginPath');
        spyOn(context, 'arc');
        spyOn(context, 'stroke');
        spyOn(context, 'closePath');

        DrawUtils.drawRing(context, x, y, radius, color);

        expect(context.strokeStyle.toLowerCase()).toEqual(color.toLowerCase());
        expect(context.beginPath.calls.count()).toEqual(1);
        expect(context.arc.calls.count()).toEqual(1);
        expect(context.arc).toHaveBeenCalledWith(x, y, radius, 0, 2 * Math.PI, false);
        expect(context.stroke.calls.count()).toEqual(1);
        expect(context.closePath.calls.count()).toEqual(1);
    });

    it("should draw a square on the canvas", function () {
        var box = {
                x: 10, y: 10,
                width: 20, height: 20
            },
            color = "#CCCCCC";
        spyOn(context, 'fillRect');

        DrawUtils.drawSquare(context, box, color);

        expect(context.fillStyle.toLowerCase()).toEqual(color.toLowerCase());
        expect(context.fillRect.calls.count()).toEqual(1);
        expect(context.fillRect).toHaveBeenCalledWith(box.x, box.y, box.width, box.height);
    });

    it("should draw a line on the canvas", function () {
        var sX = 10, sY = 20, eX = 30, eY = 40, color = "#CCCCCC";
        spyOn(context, 'beginPath');
        spyOn(context, 'moveTo');
        spyOn(context, 'lineTo');
        spyOn(context, 'stroke');
        spyOn(context, 'closePath');

        DrawUtils.drawLine(context, sX, sY, eX, eY, color);

        expect(context.strokeStyle.toLowerCase()).toEqual(color.toLowerCase());
        expect(context.beginPath.calls.count()).toEqual(1);
        expect(context.moveTo.calls.count()).toEqual(1);
        expect(context.moveTo).toHaveBeenCalledWith(sX, sY);
        expect(context.lineTo.calls.count()).toEqual(1);
        expect(context.lineTo).toHaveBeenCalledWith(eX, eY);
        expect(context.stroke.calls.count()).toEqual(1);
        expect(context.closePath.calls.count()).toEqual(1);
    });

    it("should draw a grid on the canvas", function () {
        var box = {
                x: 0, y: 0,
                width: 100, height: 100
            },
            spacing = 50, color = "#CCCCCC";
        spyOn(DrawUtils, 'drawLine');

        DrawUtils.drawGrid(context, box, spacing, color);

        expect(DrawUtils.drawLine.calls.count()).toEqual(6);
        expect(DrawUtils.drawLine).toHaveBeenCalledWith(context, 0, 0, box.width, 0, color);
        expect(DrawUtils.drawLine).toHaveBeenCalledWith(context, 0, 50, box.width, 50, color);
        expect(DrawUtils.drawLine).toHaveBeenCalledWith(context, 0, 0, 0, box.height, color);
        expect(DrawUtils.drawLine).toHaveBeenCalledWith(context, 50, 0, 50, box.height, color);
        expect(DrawUtils.drawLine).toHaveBeenCalledWith(context, 99, 0, 99, 100, color);
        expect(DrawUtils.drawLine).toHaveBeenCalledWith(context, 0, 99, 100, 99, color);
    });

    it("should draw a exclamation on the canvas", function () {
        var x = 10, y = 10, color = "#CCCCCC";
        spyOn(DrawUtils, 'drawLine');

        DrawUtils.drawExclamation(context, x, y, color);

        expect(DrawUtils.drawLine.calls.count()).toEqual(2);
        expect(DrawUtils.drawLine).toHaveBeenCalledWith(context, x, y, x, y - 1, color);
        expect(DrawUtils.drawLine).toHaveBeenCalledWith(context, x, y - 3, x, y - 13, color);
    });

    it("should draw text on the canvas", function () {
        var x = 10, y = 10, txt = "Test", color = "#CCCCCC";
        spyOn(context, 'fillText');

        DrawUtils.drawText(context, x, y, color, txt);

        expect(context.font.toLowerCase()).toEqual(DrawUtils.defaultFont.toLowerCase());
        expect(context.fillStyle.toLowerCase()).toEqual(color.toLowerCase());
        expect(context.fillText.calls.count()).toEqual(1);
        expect(context.fillText).toHaveBeenCalledWith(txt, x, y);
    });

    it("should generate a random color hex value", function () {
        var res = DrawUtils.getRandomColor();

        expect(res.length).toEqual(7);
        expect(res).toContain("#");
        for (var idx = 1; idx < res.length; idx++) {
            expect(letters.toLowerCase()).toContain(res[idx].toLowerCase());
        }
    });

    it("should generate a random green color hex value", function () {
        var res = DrawUtils.getRandomGreen(), greenLetters = '56789ABCDEF';

        expect(res.length).toEqual(7);
        expect(res).toContain("#");
        for (var x = 1; x < 3; x++) {
            expect(res[x]).toBe('0');
        }
        expect(greenLetters).toContain(res[3]);
        expect(greenLetters).toContain(res[4]);
        for (var y = 5; y < res.length; y++) {
            expect(res[y]).toBe('0');
        }
    });

    it("should generate a random red color hex value", function () {
        var res = DrawUtils.getRandomRed(), redLetters = '56789ABCDEF';

        expect(res.length).toEqual(7);
        expect(res).toContain("#");
        expect(redLetters).toContain(res[1]);
        expect(redLetters).toContain(res[2]);
        for (var idx = 3; idx < res.length; idx++) {
            expect(res[idx]).toBe('0');
        }
    });
});