var normalSpriteSheet = "images/player/chipLarge.png",
    waterSpriteSheet = "images/player/chipWaterLarge.png",
    waterDeathSprite = "images/player/waterDeathLarge.png",
    fireDeathSprite = "images/player/fireDeathLarge.png";

var Chip = {
    worldPos: null,
    screenPos: null,
    specialSlots: null,
    ssKeys: null,
    normalSprites: null,
    waterSprites: null,
    waterDeathSprite: null,
    activeSpriteSheet: null,
    curSprite: null,
    status: ALIVE,
    microchips: 0,
    itemsBack: new Image(),
    deathSound: null,
    options: {
        worldPos: New(Vector, {}),
        screenPos: New(Vector, {}),
        specialSlots: {
            FLIPPERS: null,
            FIREBOOTS: null,
            ROLLERSKATES: null,
            ICESKATES: null,
            BLUEKEY: null,
            REDKEY: null,
            GREENKEY: null,
            YELLOWKEY: null
        },
        microchips: 0,
        direction: DOWN,
        curSprite: {
            x: 0, y: 0, w: 64, h: 64
        }
    },

    constructor: function (options) {
        this.worldPos = IsNotNullOrUndefined(options.worldPos) ? options.worldPos : this.options.worldPos;
        this.screenPos = IsNotNullOrUndefined(options.screenPos) ? options.screenPos : this.options.screenPos;
        this.specialSlots = IsNotNullOrUndefined(options.specialSlots) ? options.specialSlots : this.options.specialSlots;
        this.microchips = IsNotNullOrUndefined(options.microchips) ? options.microchips : this.options.microchips;

        var tmp = new Image();
        tmp.src = normalSpriteSheet;
        this.normalSprites = tmp;
        this.activeSpriteSheet = this.normalSprites;

        tmp = new Image();
        tmp.src = waterSpriteSheet;
        this.waterSprites = tmp;

        this.curSprite = IsNotNullOrUndefined(options.curSprite) ? options.curSprite : this.options.curSprite;

        this.itemsBack.src = "images/tiles/emptyLarge.png";
        this.ssKeys = Object.keys(this.specialSlots);


        this.deathSound = New(Sound, {soundFile: DEATH});
        return this;
    },

    getStatus: function () {
        return this.status;
    },

    getIndex: function () {
        return {x: this.worldPos.x / 64, y: this.worldPos.y / 64};
    },

    move: function (dir) {
        this.worldPos.add(dir);
        this._setCurSpriteParams(dir);
    },

    removeItem: function (which) {
        this.specialSlots[which] = null;
    },

    _addToMicrochips: function () {
        this.microchips++;
        return true;
    },

    _addToSpecial: function (item) {
        this.specialSlots[item.type] = item;
        return true;
    },

    pickUp: function (item) {
        if (item === null)
            return false;
        else if (item.isMicrochip()) {
            return this._addToMicrochips(item);
        }
        else {
            return this._addToSpecial(item);
        }
    },

    _setCurSpriteParams: function (dir) {
        if (dir == DOWN)
            this.curSprite.x = 0;
        else if (dir == LEFT)
            this.curSprite.x = this.curSprite.w;
        else if (dir == UP)
            this.curSprite.x = this.curSprite.w*2;
        else if (dir == RIGHT)
            this.curSprite.x = this.curSprite.w*3;
    },

    _killPlayer: function (deathSprite) {
        var tmp = new Image();
        tmp.src = deathSprite;
        this._setCurSpriteParams(DOWN);
        this.activeSpriteSheet = tmp;
        this.status = DEAD;
        this.deathSound.play(0.8);
    },

    _resetSprite: function() {
        if (this.activeSpriteSheet === this.waterSprites) {
            this.activeSpriteSheet = this.normalSprites;
        }
    },

    handleTile: function(tile) {
        this._resetSprite();
        if ( tile.getType() === EXIT ) {
            this.status = COMPLETE;
        }
        if (this.pickUp(tile.getItem())) {
            tile.removeItem();
        }
        if (tile.getType() === WATERBLOCK) {
            tile.setType(EMPTY);
        }
        else if (tile.getType() === WATER) {
            if (this.specialSlots.FLIPPERS === null) {
                this._killPlayer(waterDeathSprite);
            }
            else {
                this.activeSpriteSheet = this.waterSprites;
            }
        }
        else if (tile.getType() === FIRE && this.specialSlots.FIREBOOTS === null) {
            this._killPlayer(fireDeathSprite);
        }
        else if (tile.getType() === ICE && this.specialSlots.ICESKATES === null) {

        }
    },

    update: function () {

    },

    renderItems: function (ctx) {
        for(var x=0;x<8; x++ ) {
            DrawUtils.drawImage(ctx, x*64, 0, this.itemsBack);
            if (this.specialSlots[this.ssKeys[x]] !== null) {
                this.specialSlots[this.ssKeys[x]].render(ctx, x * 64, 0);
            }
        }
    },

    render: function (ctx) {
        DrawUtils.drawSprite(ctx, this.activeSpriteSheet,
            this.curSprite.x, this.curSprite.y,
            this.curSprite.w, this.curSprite.h,
            this.screenPos.x, this.screenPos.y,
            this.curSprite.w, this.curSprite.h
        );
    }
};

(function (ng) {
    'use strict';

    ng.module('aidemo.models.chip.player', [
        'aidemo.service.drawUtils'
    ])
        .factory('Player', ['DrawUtils'], function (DrawUtils) {


            function Player(params) {
                params = params || {};

                if (!params.type) {
                    return "ERROR INSTANTIATING ITEM";
                }

                this.type = params.type;
                this.image = new Image();
                this.image.src = Item.ITEM_IMAGES[this.type];
            }

            var playerRoot = "images/chipsChallenge/player/";
            Player.PLAYER_IMAGES = {
                NORMAL_SPRITE_SHEET: "chipLarge.png",
                WATER_SPRITE_SHEET: "chipWaterLarge.png",
                WATER_DEATH_SPRITE: "waterDeathLarge.png",
                FIRE_DEATH_SPRITE: "fireDeathLarge.png"
            };

            Item.prototype.isMicrochip = function () {
                return this.type === Item.MICRO_CHIP;
            };

            Item.prototype.getType = function () {
                return this.type;
            };

            Item.prototype.update = function () {
            };

            Item.prototype.render = function (context, x, y) {
                DrawUtils.drawImage(context, x, y, this.image);
            };
        });
})(angular);