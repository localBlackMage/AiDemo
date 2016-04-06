(function (ng) {
    'use strict';

    ng.module('aidemo.models.chip.player', [
        'aidemo.service.utils',
        'aidemo.service.drawUtils',
        'aidemo.models.chip.globals',
        'aidemo.models.chip.item',
        'aidemo.models.chip.tile',
        'aidemo.models.chip.sound'
    ])
        .factory('Player', ['Utils', 'DrawUtils', 'Globals', 'Item', 'Tile', 'Sound',
            function (Utils, DrawUtils, Globals, Item, Tile, Sound) {

                /**
                 * Class that represents the player, Chip. Contains location data, what special items the player is holding,
                 * how many microchips the player currently has, sprites, and pertinent sounds
                 * @param params - Object with options
                 * @constructor
                 */
                function Player(params) {
                    params = params || {};
                    var specialSlotsDefault = {
                        FLIPPERS: null,
                        FIRE_BOOTS: null,
                        ROLLER_SKATES: null,
                        ICE_SKATES: null,
                        BLUE_KEY: null,
                        RED_KEY: null,
                        GREEN_KEY: null,
                        YELLOW_KEY: null
                    };

                    this.worldPos = params.worldPos ? params.worldPos : new Vector();
                    this.screenPos = params.screenPos ? params.screenPos : new Vector();
                    this.specialSlots = null;
                    _.merge(this.specialSlots, specialSlotsDefault, params.specialSlots);

                    this.numberOfMicrochips = _.isNumber(params.numberOfMicrochips) ? params.numberOfMicrochips : 0;

                    this.normalSprites = Utils.generateImageFromURLObject(Player.PLAYER_IMAGES, Player.NORMAL_SPRITE_SHEET);
                    this.waterSprites = Utils.generateImageFromURLObject(Player.PLAYER_IMAGES, Player.WATER_SPRITE_SHEET);

                    this.activeSpriteSheet = this.normalSprites;
                    this.curSprite = params.curSprite ? params.curSprite : {x: 0, y: 0, w: Globals.TILE_SIZE, h: Globals.TILE_SIZE};

                    this.itemsBack = Utils.generateImageFromURLObject(Tile.TILE_IMAGES, Tile.EMPTY);

                    this.ssKeys = Object.keys(this.specialSlots);

                    this.deathSound = new Sound({soundFile: Sound.DEATH});

                    this.status = Globals.ALIVE;
                    this.direction = Globals.DOWN;
                }

                var playerRoot = "images/chipsChallenge/player/";
                Player.PLAYER_IMAGES = {
                    NORMAL_SPRITE_SHEET: playerRoot + "chipLarge.png",
                    WATER_SPRITE_SHEET: playerRoot + "chipWaterLarge.png",
                    WATER_DEATH_SPRITE: playerRoot + "waterDeathLarge.png",
                    FIRE_DEATH_SPRITE: playerRoot + "fireDeathLarge.png"
                };

                /**
                 * Returns this Player's status
                 * @returns {string}
                 */
                Player.prototype.getStatus = function () {
                    return this.status;
                };

                /**
                 * Given a tileSize, finds the grid index the player is currently at
                 * @param tileSize - Number, default of Globals.TILE_SIZE
                 * @returns {{x: number, y: number}}
                 */
                Player.prototype.getTileIndex = function (tileSize) {
                    if (!tileSize) {
                        tileSize = Globals.TILE_SIZE;
                    }
                    return {
                        x: this.worldPos.x / tileSize,
                        y: this.worldPos.y / tileSize
                    };
                };

                /**
                 * Moves the player's worldPos in the given direction
                 * @param direction
                 */
                Player.prototype.move = function (direction) {
                    this.worldPos.add(direction);
                    this._setCurSpriteParams(direction);
                };

                /**
                 * Sets the specialSlot's corresponding item to null (removes it from the player's "inventory")
                 * @param item - String, Item.{ITEM}
                 */
                Player.prototype.removeItem = function (item) {
                    this.specialSlots[item] = null;
                };

                /**
                 * Given an Item object, sets the corresponding specialSlots to that Item
                 * @param item - Item object
                 * @returns {boolean} - true, meaning the player picked something up
                 * @private
                 *
                 * @see Item
                 */
                Player.prototype._addItem = function (item) {
                    this.specialSlots[item.type] = item;
                    return true;
                };

                /**
                 * Increments the player's numberOfMicrochips
                 * @returns {boolean} - true, meaning the player picked something up
                 * @private
                 */
                Player.prototype._addToMicrochips = function () {
                    this.numberOfMicrochips++;
                    return true;
                };

                /**
                 * Given an Item, will return false if the item is falsy, add to microchips if it is a microchip,
                 * else will add the item to the specialSlots
                 * @param item - Item object
                 * @returns {boolean}
                 *
                 * @see Item
                 */
                Player.prototype.pickUp = function (item) {
                    if (!item) {
                        return false;
                    }
                    else if (item.isMicrochip()) {
                        return this._addToMicrochips(item);
                    }
                    else {
                        return this._addItem(item);
                    }
                };

                Player.prototype._setCurSpriteParams = function (direction) {
                    if (direction === Globals.DOWN) {
                        this.curSprite.x = 0;
                    }
                    else if (direction === Globals.LEFT) {
                        this.curSprite.x = this.curSprite.w;
                    }
                    else if (direction === Globals.UP) {
                        this.curSprite.x = this.curSprite.w * 2;
                    }
                    else if (direction === Globals.RIGHT) {
                        this.curSprite.x = this.curSprite.w * 3;
                    }
                };

                Player.prototype._killPlayer = function (deathSprite) {
                    var tmp = new Image();
                    tmp.src = deathSprite;
                    this._setCurSpriteParams(DOWN);
                    this.activeSpriteSheet = tmp;
                    this.status = DEAD;
                    this.deathSound.play(0.8);
                };

                Player.prototype._resetSprite = function () {
                    if (this.activeSpriteSheet === this.waterSprites) {
                        this.activeSpriteSheet = this.normalSprites;
                    }
                };

                Player.prototype.handleTile = function (tile) {
                    this._resetSprite();
                    if (tile.getType() === Tile.EXIT) {
                        this.status = Globals.COMPLETE;
                    }
                    if (this.pickUp(tile.getItem())) {
                        tile.removeItem();
                    }
                    if (tile.getType() === Tile.WATER_BLOCK) {
                        tile.setType(Tile.EMPTY);
                    }
                    else if (tile.getType() === Tile.WATER) {
                        if (this.specialSlots.FLIPPERS === null) {
                            this._killPlayer(Utils.generateImageFromURLObject(Player.PLAYER_IMAGES, Player.WATER_DEATH_SPRITE));
                        }
                        else {
                            this.activeSpriteSheet = this.waterSprites;
                        }
                    }
                    else if (tile.getType() === Tile.FIRE && this.specialSlots.FIRE_BOOTS === null) {
                        this._killPlayer(Utils.generateImageFromURLObject(Player.PLAYER_IMAGES, Player.FIRE_DEATH_SPRITE));
                    }
                    else if (tile.getType() === Tile.ICE && this.specialSlots.ICE_SKATES === null) {

                    }
                };

                Player.prototype.update = function () {

                };

                /**
                 * Given a canvas context, will call the render function on all Item's within the Player's
                 * specialSlots object
                 * @param context - Canvas element's context property
                 */
                Player.prototype.renderItems = function (context) {
                    for (var x = 0; x < 8; x++) {
                        DrawUtils.drawImage(ctx, x * Globals.TILE_SIZE, 0, this.itemsBack);
                        if (this.specialSlots[this.ssKeys[x]] !== null) {
                            this.specialSlots[this.ssKeys[x]].render(context, x * Globals.TILE_SIZE, 0);
                        }
                    }
                };

                /**
                 * Given a canvas context, will render the Player
                 * @param context - Canvas element's context property
                 */
                Player.prototype.render = function (context) {
                    DrawUtils.drawSprite(context, this.activeSpriteSheet,
                        this.curSprite.x, this.curSprite.y,
                        this.curSprite.w, this.curSprite.h,
                        this.screenPos.x, this.screenPos.y,
                        this.curSprite.w, this.curSprite.h
                    );
                };

                return Player;
            }]);
})(angular);