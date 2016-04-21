describe("Player Model", function () {
    'use strict';
    var defaultPlayer, Player, Utils, DrawUtils, Globals, Item, Tile, Sound, Vector,
        createElementItems, angularElementSpy;

    beforeEach(function () {
        module('aidemo.models.chip.player');

        inject(function (_Player_, _Utils_, _DrawUtils_, _Globals_, _Item_, _Tile_, _Sound_, _Vector_) {
            Player = _Player_;
            Utils = _Utils_;
            DrawUtils = _DrawUtils_;
            Globals = _Globals_;
            Item = _Item_;
            Tile = _Tile_;
            Sound = _Sound_;
            Vector = _Vector_;

            /**
             * Spy Items for the Sound model
             */
            createElementItems = {
                "<audio />": {
                    appendChild: function () {
                    },
                    load: function () {
                    },
                    play: function () {
                    }
                },
                "<source />": {
                    src: ''
                }
            };
            angularElementSpy = spyOn(angular, 'element').and.callFake(function (type) {
                return createElementItems[type];
            });

            defaultPlayer = {
                worldPos: new Vector(),
                screenPos: new Vector()
            };
        });
    });

    afterEach(function () {
        angularElementSpy.and.callThrough();
    });

    it('should instantiate properly', function () {
        var image = {src: 'someUrl'},
            call = 0;
        spyOn(Utils, 'generateImageFromURLObject').and.callFake(function (imageLib, imageKey) {
            if (call === 0) {
                expect(imageLib).toBe(Player.PLAYER_IMAGES);
                expect(imageKey).toBe(Player.NORMAL_SPRITE_SHEET);
            }
            else if (call === 1) {
                expect(imageLib).toBe(Player.PLAYER_IMAGES);
                expect(imageKey).toBe(Player.WATER_SPRITE_SHEET);
            }
            else {
                expect(imageLib).toBe(Tile.TILE_IMAGES);
                expect(imageKey).toBe(Tile.EMPTY);
            }
            call++;
            return image;
        });

        var player = new Player(defaultPlayer);

        expect(Utils.generateImageFromURLObject.calls.count()).toBe(3);

        expect(player.worldPos).toBe(defaultPlayer.worldPos);
        expect(player.screenPos).toBe(defaultPlayer.screenPos);
        expect(player.specialSlots.FLIPPERS).toBe(null);
        expect(player.numberOfMicrochips).toBe(0);

        expect(player.normalSprites).toBe(image);
        expect(player.waterSprites).toBe(image);
        expect(player.activeSpriteSheet).toBe(player.normalSprites);
        expect(player.itemsBack).toBe(image);

        expect(player.deathSound).toBeDefined();

        expect(player.status).toBe(Globals.ALIVE);
        expect(player.direction).toBe(Globals.DOWN);
    });

    it("should return the player's status", function () {
        var player = new Player(defaultPlayer);

        var status = player.getStatus();

        expect(status).toBe(Globals.ALIVE);
    });

    it("should return the x and y tile index of the player's location in the world", function () {
        var player = new Player(defaultPlayer);

        player.worldPos = new Vector({x: 128, y: 256});

        var tileIndex = player.getTileIndex(Globals.TILE_SIZE);

        expect(tileIndex.x).toBe(2);
        expect(tileIndex.y).toBe(4);

        tileIndex = player.getTileIndex();

        expect(tileIndex.x).toBe(2);
        expect(tileIndex.y).toBe(4);
    });

    it("should move the player in a given direction and change the current sprite direction accordingly", function () {
        var player = new Player(defaultPlayer),
            direction = new Vector({x: 64});

        spyOn(player.worldPos, 'add').and.callThrough();
        spyOn(player, '_setCurSpriteParams').and.callFake(function (dir) {
            expect(dir).toBe(direction);
        });

        player.move(direction);

        expect(player.worldPos.add).toHaveBeenCalled();
        expect(player.worldPos.x).toBe(64);
        expect(player.worldPos.y).toBe(0);
        expect(player._setCurSpriteParams).toHaveBeenCalled();
    });

    it("should know if a given item is within the player's specialSlots map", function () {
        var player = new Player(defaultPlayer);

        var doesExist = player._doesItemExist(Item.FLIPPERS);

        expect(doesExist).toBeTruthy();

        doesExist = player._doesItemExist("clearly does not exist");

        expect(doesExist).toBeFalsy();
    });

    it("should set a specified item in the specialSlots to null", function () {
        var player = new Player(defaultPlayer);
        player.specialSlots.FLIPPERS = {};

        spyOn(player, '_doesItemExist').and.callThrough();

        player.removeItem(Item.FLIPPERS);

        expect(player._doesItemExist).toHaveBeenCalled();
        expect(player.specialSlots.FLIPPERS).toBe(null);
    });

    it("should set a specified item to an Item object", function () {
        var player = new Player(defaultPlayer),
            flippers = {type: Item.FLIPPERS};
        player.specialSlots.FLIPPERS = null;

        spyOn(player, '_doesItemExist').and.callThrough();

        var result = player._addItem(flippers);

        expect(player._doesItemExist).toHaveBeenCalled();
        expect(player.specialSlots.FLIPPERS).toBe(flippers);
        expect(result).toBeTruthy();

        result = player._addItem({type: "fake"});

        expect(result).toBeFalsy();
    });

    it("should increment the numberOfMicrochips", function () {
        var player = new Player(defaultPlayer);

        player.numberOfMicrochips = 0;

        var result = player._addToMicrochips();

        expect(player.numberOfMicrochips).toBe(1);
        expect(result).toBeTruthy();
    });

    describe("should pick up an item", function () {
        it("and return false if the item is null, undefined, or empty", function () {
            var player = new Player(defaultPlayer);
            var resultA = player.pickUp(null),
                resultB = player.pickUp(),
                resultC = player.pickUp('');

            expect(resultA).toBeFalsy();
            expect(resultB).toBeFalsy();
            expect(resultC).toBeFalsy();
        });

        it("and call _addToMicrochips if it is a microchip and return the result", function () {
            var player = new Player(defaultPlayer);
            var item = {
                isMicrochip: function () {
                }
            };
            spyOn(item, "isMicrochip").and.callFake(function () {
                return true;
            });
            spyOn(player, "_addToMicrochips").and.callFake(function (item) {
                return true;
            });


            var result = player.pickUp(item);

            expect(item.isMicrochip).toHaveBeenCalled();
            expect(player._addToMicrochips).toHaveBeenCalled();
            expect(result).toBeTruthy();
        });

        it("and call _addItem if it is not a microchip", function () {
            var player = new Player(defaultPlayer);
            var item = {
                isMicrochip: function () {
                }
            };
            spyOn(item, "isMicrochip").and.callFake(function () {
                return false;
            });
            spyOn(player, "_addItem").and.callFake(function (item) {
                return true;
            });


            var result = player.pickUp(item);

            expect(item.isMicrochip).toHaveBeenCalled();
            expect(player._addItem).toHaveBeenCalled();
            expect(result).toBeTruthy();
        });
    });

    it("should set the curSprite x coordinate according to a given direction vector", function () {
        var player = new Player(defaultPlayer);

        player._setCurSpriteParams(new Vector({y: Globals.TILE_SIZE}));

        expect(player.curSprite.x).toBe(0);

        player._setCurSpriteParams(new Vector({x: -Globals.TILE_SIZE}));

        expect(player.curSprite.x).toBe(player.curSprite.w);

        player._setCurSpriteParams(new Vector({y: -Globals.TILE_SIZE}));

        expect(player.curSprite.x).toBe(player.curSprite.w * 2);

        player._setCurSpriteParams(new Vector({x: Globals.TILE_SIZE}));

        expect(player.curSprite.x).toBe(player.curSprite.w * 3);
    });

    it("should kill the player", function () {
        var player = new Player(defaultPlayer),
            deathSprite = {};

        spyOn(player, '_setCurSpriteParams').and.callFake(function (dir) {
            expect(dir).toBe(Globals.DOWN);
        });
        spyOn(player.deathSound, 'play').and.callFake(function (time) {
            expect(time).toBe(0.8);
        });

        player._killPlayer(deathSprite);

        expect(player._setCurSpriteParams).toHaveBeenCalled();
        expect(player.activeSpriteSheet).toBe(deathSprite);
        expect(player.status).toBe(Globals.DEAD);
    });

    it("should reset the activeSpriteSheet to normalSprites if it is already the waterSprites", function () {
        var player = new Player(defaultPlayer);

        player.activeSpriteSheet = player.waterSprites;

        player._resetSprite();

        expect(player.activeSpriteSheet).toBe(player.normalSprites);
    });

    it("", function () {
        var player = new Player(defaultPlayer);
    });

    it("", function () {
        var player = new Player(defaultPlayer);
    });
});