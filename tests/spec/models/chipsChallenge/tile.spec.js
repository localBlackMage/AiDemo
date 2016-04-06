describe("Tile Model", function () {
    'use strict';
    var defaultTile, Tile, Item, Obstacle, Globals, Vector, Utils, DrawUtils;
    beforeEach(function () {
        module('aidemo.models.chip.tile', 'aidemo.models.chip.item', 'aidemo.models.chip.obstacle');

        inject(function (_Tile_, _Item_, _Obstacle_, _Globals_, _Utils_, _DrawUtils_, _Vector_) {
            Tile = _Tile_;
            Item = _Item_;
            Obstacle = _Obstacle_;
            Utils = _Utils_;
            Globals = _Globals_;
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
        expect(function () {
            var tile = new Tile();
        })
            .toThrow(new Error("ERROR INSTANTIATING TILE: MUST HAVE A TYPE"));
    });

    describe("should return a neighbor tile in a given direction", function () {
        var tile, upTile, downTile, rightTile, leftTile;

        beforeEach(function () {
            tile = new Tile(defaultTile);
            rightTile = new Tile({
                type: Tile.EMPTY,
                worldPos: new Vector({x: Globals.TILE_SIZE})
            });
            leftTile = new Tile({
                type: Tile.EMPTY,
                worldPos: new Vector({x: -Globals.TILE_SIZE})
            });
            downTile = new Tile({
                type: Tile.EMPTY,
                worldPos: new Vector({y: Globals.TILE_SIZE})
            });
            upTile = new Tile({
                type: Tile.EMPTY,
                worldPos: new Vector({y: -Globals.TILE_SIZE})
            });

            tile.neighbors = [upTile, downTile, rightTile, leftTile];
        });

        it("should throw an error if the given direction is not Globals.TILE_SIZE in length", function () {
            expect(function () {
                var result = tile.getNeighborTileInDirection(new Vector());
            })
                .toThrow(new Error("ERROR GETTING NEIGHBOR FOR TILE: DIRECTION X OR Y MUST MATCH GLOBALS.TILE_SIZE"));
        });

        it("should return the UP neighbor", function () {
            var result = tile.getNeighborTileInDirection(Globals.UP);

            expect(result).toBe(upTile);
        });
        it("should return the DOWN neighbor", function () {
            var result = tile.getNeighborTileInDirection(Globals.DOWN);

            expect(result).toBe(downTile);
        });
        it("should return the RIGHT neighbor", function () {
            var result = tile.getNeighborTileInDirection(Globals.RIGHT);

            expect(result).toBe(rightTile);
        });
        it("should return the LEFT neighbor", function () {
            var result = tile.getNeighborTileInDirection(Globals.LEFT);

            expect(result).toBe(leftTile);
        });
    });

    it("should return the tile's neighbors", function () {
        var tile = new Tile(defaultTile);
        tile.neighbors = [{}, {}];

        var neighbors = tile.getNeighbors();

        expect(neighbors).toBe(tile.neighbors);
    });

    it("should set the tile's neighbors", function () {
        var tile = new Tile(defaultTile),
            neighbors = [{}, {}];

        tile.fillNeighbors();

        expect(tile.neighbors.length).toBe(0);

        tile.fillNeighbors(neighbors);

        expect(tile.neighbors).toBe(neighbors);
    });

    it("should 'move' the tile by adding a vector to the screenPos", function () {
        var tile = new Tile(defaultTile),
            amount = new Vector({x: 1, y: 1});

        spyOn(tile.screenPos, 'add').and.callFake(function (other) {
            expect(other).toBe(amount);
        });

        tile.move(amount);

        expect(tile.screenPos.add).toHaveBeenCalled();
    });

    it("should remove the item", function () {
        var tile = new Tile(defaultTile);
        tile.item = {};

        tile.removeItem();

        expect(tile.item).toBe(null);
    });

    it("should return the item", function () {
        var item = {},
            tile = new Tile(defaultTile);
        tile.item = item;

        var result = tile.getItem();

        expect(result).toBe(item);
    });

    it("should remove the obstacle", function () {
        var tile = new Tile(defaultTile);
        tile.obstacle = {};

        tile.removeObstacle();

        expect(tile.obstacle).toBe(null);
    });

    it("should return the obstacle", function () {
        var obstacle = {},
            tile = new Tile(defaultTile);
        tile.obstacle = obstacle;

        var result = tile.getObstacle();

        expect(result).toBe(obstacle);
    });

    it("should set the obstacle", function () {
        var obstacle = {},
            tile = new Tile(defaultTile);

        tile.setObstacle(obstacle);

        expect(tile.obstacle).toBe(obstacle);
    });

    it('should return the type', function () {
        var tile = new Tile(defaultTile);

        var type = tile.getType();

        expect(type).toBe(tile.type);
    });

    it('should set the type and create a new image', function () {
        var tile = new Tile(defaultTile);

        spyOn(Utils, 'generateImageFromURLObject').and.callFake(function (imageLib, imageKey) {
            expect(imageLib).toBe(Tile.TILE_IMAGES);
            expect(imageKey).toBe(Tile.BLOCK);
            return {};
        });

        tile.setType(Tile.BLOCK);

        expect(tile.type).toBe(Tile.BLOCK);
        expect(Utils.generateImageFromURLObject).toHaveBeenCalled();
    });

    it("should call it's item's render method if it has an item", function () {
        var item = new Item({type: Item.FLIPPERS}),
            tileObject = {
                type: Tile.EMPTY,
                worldPos: new Vector(),
                screenPos: new Vector(),
                item: item,
                obstacle: null,
                neighbors: []
            },
            tile = new Tile(tileObject),
            context = {};

        spyOn(item, 'render').and.callFake(function (ctx, x, y) {
            expect(ctx).toBe(context);
            expect(x).toBe(tile.screenPos.x);
            expect(y).toBe(tile.screenPos.y);
        });

        tile._renderItem(context);

        expect(item.render).toHaveBeenCalled();
    });

    it("should call it's obstacle's render method if it has an obstacle", function () {
        var obstacle = new Obstacle({type: Obstacle.DOOR}),
            tileObject = {
                type: Tile.EMPTY,
                worldPos: new Vector(),
                screenPos: new Vector(),
                item: null,
                obstacle: obstacle,
                neighbors: []
            },
            tile = new Tile(tileObject),
            context = {};

        spyOn(obstacle, 'render').and.callFake(function (ctx, x, y) {
            expect(ctx).toBe(context);
            expect(x).toBe(tile.screenPos.x);
            expect(y).toBe(tile.screenPos.y);
        });

        tile._renderObstacle(context);

        expect(obstacle.render).toHaveBeenCalled();
    });

    it("should render itself, it's item, then it's obstacle", function () {
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