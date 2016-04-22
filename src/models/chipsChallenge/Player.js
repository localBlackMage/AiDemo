(function (ng) {
    'use strict';

    ng.module('aidemo.models.chip.player', [
        'aidemo.service.utils',
        'aidemo.service.drawUtils',
        'aidemo.models.chip.globals',
        'aidemo.models.chip.item',
        'aidemo.models.chip.tile',
        'aidemo.models.chip.sound',
        'aidemo.models.vector'
    ])
        .factory('Player', ['Utils', 'DrawUtils', 'Globals', 'Item', 'Tile', 'Sound', 'Vector',
            function (Utils, DrawUtils, Globals, Item, Tile, Sound, Vector) {

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
                    this.specialSlots = specialSlotsDefault;
                    _.merge(this.specialSlots, specialSlotsDefault, params.specialSlots);

                    this.numberOfMicrochips = _.isNumber(params.numberOfMicrochips) ? params.numberOfMicrochips : 0;

                    this.normalSprites = Utils.generateImageFromURLObject(Player.PLAYER_IMAGES, Player.NORMAL_SPRITE_SHEET);
                    this.waterSprites = Utils.generateImageFromURLObject(Player.PLAYER_IMAGES, Player.WATER_SPRITE_SHEET);

                    this.activeSpriteSheet = this.normalSprites;
                    this.curSprite = params.curSprite ? params.curSprite : {
                        x: 0,
                        y: 0,
                        w: Globals.TILE_SIZE,
                        h: Globals.TILE_SIZE
                    };

                    this.itemsBack = Utils.generateImageFromURLObject(Tile.TILE_IMAGES, Tile.EMPTY);

                    this.specialSlotsKeys = Object.keys(this.specialSlots);

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
                 *
                 * @see Vector
                 */
                Player.prototype.move = function (direction) {
                    this.worldPos.add(direction);
                    this._setCurSpriteParams(direction);
                };

                /**
                 * Given an item type string, returns a boolean that is true
                 * if the item type string exists within specialSlotKeys and
                 * false if not
                 * @param item - String, Item.type
                 * @returns {boolean} - True if item exists in specialSlotKeys, false if not
                 * @private
                 *
                 * @see Item
                 */
                Player.prototype._doesItemExist = function (item) {
                    return _.findIndex(this.specialSlotsKeys, function (key) {
                            return key === item;
                        }) > -1;
                };

                /**
                 * Sets the specialSlot's corresponding item to null (removes it from the player's "inventory")
                 * @param item - String, Item.{ITEM}
                 */
                Player.prototype.removeItem = function (item) {
                    // Don't want to add garbage properties if whatever's passed in doesn't exist within the map
                    if (this._doesItemExist(item)) {
                        this.specialSlots[item] = null;
                    }
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
                    // Don't want to add garbage properties if whatever's passed in doesn't exist within the map
                    if (this._doesItemExist(item.type)) {
                        this.specialSlots[item.type] = item;
                        return true;
                    }
                    return false;
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

                /**
                 * Given a directional Vector, sets the curSprite.x to the corresponding facing sprite
                 * @param direction - Vector matching a Global direction vector
                 * @private
                 *
                 * @see Vector
                 */
                Player.prototype._setCurSpriteParams = function (direction) {
                    if (Globals.DOWN.compare(direction)) {
                        this.curSprite.x = 0;
                    }
                    else if (Globals.LEFT.compare(direction)) {
                        this.curSprite.x = this.curSprite.w;
                    }
                    else if (Globals.UP.compare(direction)) {
                        this.curSprite.x = this.curSprite.w * 2;
                    }
                    else if (Globals.RIGHT.compare(direction)) {
                        this.curSprite.x = this.curSprite.w * 3;
                    }
                };

                /**
                 * Given a sprite image, sets the activeSpriteSheet to the image object and plays the player's deathSound
                 * @param deathSprite - Image object
                 * @private
                 */
                Player.prototype._killPlayer = function (deathSprite) {
                    this._setCurSpriteParams(Globals.DOWN);
                    this.activeSpriteSheet = deathSprite;
                    this.status = Globals.DEAD;
                    this.deathSound.play(0.8);
                };

                /**
                 * If the activeSpriteSheet is currently the waterSprites, resets it to the normalSprites
                 * @private
                 */
                Player.prototype._resetSprite = function () {
                    if (this.activeSpriteSheet === this.waterSprites) {
                        this.activeSpriteSheet = this.normalSprites;
                    }
                };

                /**
                 * Sets the player's status to Globals.COMPLETE
                 * @param tile - Tile object
                 * @private
                 *
                 * @see Tile
                 */
                Player.prototype._handle_EXIT = function (tile) {
                    this.status = Globals.COMPLETE;
                };

                /**
                 * Given a Tile object, calls tile.setType and sets it to Tile.EMPTY
                 * @param tile - Tile Object
                 * @private
                 *
                 * @see Tile
                 */
                Player.prototype._handle_WATER_BLOCK = function (tile) {
                    tile.setType(Tile.EMPTY);
                };

                /**
                 * If the player does not have FLIPPERS, kills the player, else sets the activeSpriteSheet to waterSprites
                 * @param tile - Tile Object
                 * @private
                 *
                 * @see Tile
                 */
                Player.prototype._handle_WATER = function (tile) {
                    if (!this.specialSlots.FLIPPERS) {
                        this._killPlayer(Utils.generateImageFromURLObject(Player.PLAYER_IMAGES, Player.WATER_DEATH_SPRITE));
                    }
                    else {
                        this.activeSpriteSheet = this.waterSprites;
                    }
                };

                /**
                 * If the player does not have FIRE_BOOTS, kills the player, else does nothing
                 * @param tile - Tile Object
                 * @private
                 *
                 * @see Tile
                 */
                Player.prototype._handle_FIRE = function (tile) {
                    if (!this.specialSlots.FIRE_BOOTS) {
                        this._killPlayer(Utils.generateImageFromURLObject(Player.PLAYER_IMAGES, Player.FIRE_DEATH_SPRITE));
                    }
                };

                /**
                 * If the player does not have ICE_SKATES, moves the player another tile forward in the direction
                 * they're facing, else does nothing
                 * @param tile - Tile object
                 * @private
                 *
                 * @see Tile
                 */
                Player.prototype._handle_ICE = function (tile) {
                    if (!this.specialSlots.ICE_SKATES) {

                    }
                };

                /**
                 * Given a Tile object, calls resetSprite, attempts to pick up an item from the tile, and attempts
                 * to call a _handle_{TILE.TYPE} function
                 * @param tile - Tile object
                 *
                 * @see Tile
                 */
                Player.prototype.handleTile = function (tile) {
                    this._resetSprite();

                    if (this.pickUp(tile.getItem())) {
                        tile.removeItem();
                    }

                    if (_.isFunction(this["_handle_" + tile.getType()])) {
                        this["_handle_" + tile.getType()](tile);
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
                        DrawUtils.drawImage(context, x * Globals.TILE_SIZE, 0, this.itemsBack);
                        if (this.specialSlots[this.specialSlotsKeys[x]]) {
                            this.specialSlots[this.specialSlotsKeys[x]].render(context, x * Globals.TILE_SIZE, 0);
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