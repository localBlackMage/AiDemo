describe("Tile Model", function () {
    'use strict';
    var defaultTile, Tile, Vector, Utils, DrawUtils;
    beforeEach(function () {
        module('aidemo.models.chip.tile');//'aidemo.service.utils', 'aidemo.service.drawUtils', 'aidemo.models.chip.tile');

        inject(function (_Tile_, _Utils_, _DrawUtils_, _Vector_) {
            Tile = _Tile_;
            Utils = _Utils_;
            DrawUtils = _DrawUtils_;
            Vector = _Vector_;
            defaultTile = {
                type: Tile.EMPTY,
                worldPos: new Vector(),
                screenPos: new Vector(),
                item: null,
                obstacle: null,
                neighbors: []
            };
        });
    });

    it('should instantiate properly', function () {
        var image = {src: 'someUrl'};
        spyOn(Utils, 'generateImageFromURLObject').and.callFake(function (imageLib, imageKey) {
            expect(imageLib).toBe(Tile.TILE_IMAGES);
            expect(imageKey).toBe(Tile.EMPTY);
            return image;
        });
    
        var tile = new Tile(defaultTile);
    
        expect(tile.type).toBe(Tile.EMPTY);
        expect(Utils.generateImageFromURLObject).toHaveBeenCalled();
        expect(tile.image).toBe(image);
        expect(tile.worldPos).toBe(defaultTile.worldPos);
        expect(tile.screenPos).toBe(defaultTile.screenPos);
        expect(tile.item).toBe(defaultTile.item);
        expect(tile.obstacle).toBe(defaultTile.obstacle);
        expect(tile.neighbors).toBe(defaultTile.neighbors);
    });
    
    it('should throw an error if a type is not provided', function () {
        expect( function() {
            var tile = new Tile();
        })
            .toThrow(new Error("ERROR INSTANTIATING TILE: MUST HAVE A TYPE"));
    });

    //it('should return whether or not type is Tile.MICRO_CHIP', function () {
    //    var tile = new Tile(defaultTile);
    //
    //    var result = tile.isMicrochip();
    //
    //    expect(result).toBeTruthy();
    //
    //    tile.type = Tile.FIRE_BOOTS;
    //
    //    result = tile.isMicrochip();
    //
    //    expect(result).toBeFalsy();
    //});
    //
    //it('should return the type', function () {
    //    var tile = new Tile(defaultTile);
    //
    //    var type = tile.getType();
    //
    //    expect(type).toBe(tile.type);
    //});

    it('should call DrawUtils.drawImage', function () {
        var tile = new Tile(defaultTile),
            context = {};

        spyOn(DrawUtils, 'drawImage').and.callFake(function (ctx, x, y) {
            expect(ctx).toBe(context);
            expect(x).toBe(tile.screenPos.x);
            expect(y).toBe(tile.screenPos.y);
        });
        spyOn(tile, '_renderItem').and.callFake(function (ctx) {
            expect(ctx).toBe(context);
        });
        spyOn(tile, '_renderObstacle').and.callFake(function (ctx) {
            expect(ctx).toBe(context);
        });

        tile.render(context);

        expect(DrawUtils.drawImage).toHaveBeenCalled();
        expect(tile._renderItem).toHaveBeenCalled();
        expect(tile._renderObstacle).toHaveBeenCalled();
    });
});