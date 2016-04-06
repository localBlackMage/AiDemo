describe("Obstacle Model", function () {
    'use strict';
    var defaultObstacle, Obstacle, Utils, DrawUtils;
    beforeEach(function () {
        module('aidemo.service.utils', 'aidemo.service.drawUtils', 'aidemo.models.chip.obstacle');

        inject(function (_Obstacle_, _Utils_, _DrawUtils_) {
            Obstacle = _Obstacle_;
            Utils = _Utils_;
            DrawUtils = _DrawUtils_;
            defaultObstacle = {type: Obstacle.CHIP_DOOR};
        });
    });

    it('should instantiate properly', function () {
        var image = {src: 'someUrl'};
        spyOn(Utils, 'generateImageFromURLObject').and.callFake(function (imageLib, imageKey) {
            expect(imageLib).toBe(Obstacle.OBSTACLE_IMAGES);
            expect(imageKey).toBe(Obstacle.CHIP_DOOR);
            return image;
        });

        var obstacle = new Obstacle(defaultObstacle);

        expect(obstacle.type).toBe(Obstacle.CHIP_DOOR);
        expect(Utils.generateImageFromURLObject).toHaveBeenCalled();
        expect(obstacle.image).toBe(image);
    });

    it('should throw an error if a type is not provided', function () {
        expect( function() {
            var obstacle = new Obstacle();
        })
            .toThrow(new Error("ERROR INSTANTIATING OBSTACLE: MUST HAVE A TYPE"));
    });

    it("should return whether or not it is a {COLOR}_DOOR", function() {
        spyOn(Utils, 'generateImageFromURLObject').and.callFake(function (imageLib, imageKey) {
            expect(imageLib).toBe(Obstacle.OBSTACLE_IMAGES);
            return {};
        });

        var blueDoor = new Obstacle({type: Obstacle.BLUE_DOOR}),
            greenDoor = new Obstacle({type: Obstacle.GREEN_DOOR}),
            redDoor = new Obstacle({type: Obstacle.RED_DOOR}),
            yellowDoor = new Obstacle({type: Obstacle.YELLOW_DOOR}),
            chipDoor = new Obstacle({type: Obstacle.CHIP_DOOR});

        var resultBlue = blueDoor.isColoredDoor(),
            resultGreen = greenDoor.isColoredDoor(),
            resultRed = redDoor.isColoredDoor(),
            resultYellow = yellowDoor.isColoredDoor(),
            resultChipDoor = chipDoor.isColoredDoor();

        expect(resultBlue).toBeTruthy();
        expect(resultGreen).toBeTruthy();
        expect(resultRed).toBeTruthy();
        expect(resultYellow).toBeTruthy();
        expect(resultChipDoor).toBeFalsy();
    });

    it('should return the correct key for a door string', function () {
        spyOn(Utils, 'generateImageFromURLObject').and.callFake(function (imageLib, imageKey) {
            expect(imageLib).toBe(Obstacle.OBSTACLE_IMAGES);
            return {};
        });

        var blueDoor = new Obstacle({type: Obstacle.BLUE_DOOR}),
            greenDoor = new Obstacle({type: Obstacle.GREEN_DOOR}),
            redDoor = new Obstacle({type: Obstacle.RED_DOOR}),
            yellowDoor = new Obstacle({type: Obstacle.YELLOW_DOOR});

        var blueKey = blueDoor.doorToKey(),
            greenKey = greenDoor.doorToKey(),
            redKey = redDoor.doorToKey(),
            yellowKey = yellowDoor.doorToKey();

        expect(blueKey).toBe("BLUE_KEY");
        expect(greenKey).toBe("GREEN_KEY");
        expect(redKey).toBe("RED_KEY");
        expect(yellowKey).toBe("YELLOW_KEY");
    });

    it('should return the type', function () {
        var obstacle = new Obstacle(defaultObstacle);

        var type = obstacle.getType();

        expect(type).toBe(obstacle.type);
    });

    it('should call DrawUtils.drawImage', function () {
        var context = {}, xCoord = 10, yCoord = 15;
        spyOn(DrawUtils, 'drawImage').and.callFake(function (ctx, x, y) {
            expect(ctx).toBe(context);
            expect(x).toBe(xCoord);
            expect(y).toBe(yCoord);
        });

        var obstacle = new Obstacle(defaultObstacle);

        obstacle.render(context, xCoord, yCoord);

        expect(DrawUtils.drawImage).toHaveBeenCalled();
    });
});