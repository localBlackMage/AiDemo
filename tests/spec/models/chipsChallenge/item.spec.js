describe("Item Model", function () {
    'use strict';
    var defaultItem, Item, Utils, DrawUtils;
    beforeEach(function () {
        module('aidemo.service.utils', 'aidemo.service.drawUtils', 'aidemo.models.chip.item');

        inject(function (_Item_, _Utils_, _DrawUtils_) {
            Item = _Item_;
            Utils = _Utils_;
            DrawUtils = _DrawUtils_;
            defaultItem = {type: Item.MICRO_CHIP};
        });
    });

    it('should instantiate properly', function () {
        var image = {src: 'someUrl'};
        spyOn(Utils, 'generateImageFromURLObject').and.callFake(function (imageLib, imageKey) {
            expect(imageLib).toBe(Item.ITEM_IMAGES);
            expect(imageKey).toBe(Item.MICRO_CHIP);
            return image;
        });

        var item = new Item(defaultItem);

        expect(item.type).toBe(Item.MICRO_CHIP);
        expect(Utils.generateImageFromURLObject).toHaveBeenCalled();
        expect(item.image).toBe(image);
    });

    it('should throw an error if a type is not provided', function () {
        expect( function() {
            var item = new Item();
        })
            .toThrow(new Error("ERROR INSTANTIATING ITEM: MUST HAVE A TYPE"));
    });

    it('should return whether or not type is Item.MICRO_CHIP', function () {
        var item = new Item(defaultItem);

        var result = item.isMicrochip();

        expect(result).toBeTruthy();

        item.type = Item.FIRE_BOOTS;

        result = item.isMicrochip();

        expect(result).toBeFalsy();
    });

    it('should return the type', function () {
        var item = new Item(defaultItem);

        var type = item.getType();

        expect(type).toBe(item.type);
    });

    it('should call DrawUtils.drawImage', function () {
        var context = {}, xCoord = 10, yCoord = 15;
        spyOn(DrawUtils, 'drawImage').and.callFake(function (ctx, x, y) {
            expect(ctx).toBe(context);
            expect(x).toBe(xCoord);
            expect(y).toBe(yCoord);
        });

        var item = new Item(defaultItem);

        item.render(context, xCoord, yCoord);

        expect(DrawUtils.drawImage).toHaveBeenCalled();
    });
});