(function (ng) {
    'use strict';

    ng.module('aidemo.models.chip.item', [
        'aidemo.service.drawUtils'
    ])
        .factory('Item', ['DrawUtils'], function (DrawUtils) {


            function Item(params) {
                params = params || {};

                if (!params.type) {
                    return "ERROR INSTANTIATING ITEM";
                }

                this.type = params.type;
                this.image = new Image();
                this.image.src = Item.ITEM_IMAGES[this.type];
            }

            var itemRoot = "images/chipsChallenge/items/";
            Item.ITEM_IMAGES = {
                FLIPPERS: itemRoot + "flippersLarge.png",
                FIRE_BOOTS: itemRoot + "firebootsLarge.png",
                ROLLER_SKATES: itemRoot + "rollerskatesLarge.png",
                ICE_SKATES: itemRoot + "iceskatesLarge.png",
                BLUE_KEY: itemRoot + "bluekeyLarge.png",
                RED_KEY: itemRoot + "redkeyLarge.png",
                GREEN_KEY: itemRoot + "greenkeyLarge.png",
                YELLOW_KEY: itemRoot + "yellowkeyLarge.png",
                MICRO_CHIP: itemRoot + "microchipLarge.png"
            };

            Item.FLIPPERS = "FLIPPERS";
            Item.FIRE_BOOTS = "FIRE_BOOTS";
            Item.ROLLER_SKATES = "ROLLER_SKATES";
            Item.ICE_SKATES = "ICE_SKATES";
            Item.BLUE_KEY = "BLUE_KEY";
            Item.RED_KEY = "RED_KEY";
            Item.GREEN_KEY = "GREEN_KEY";
            Item.YELLOW_KEY = "YELLOW_KEY";
            Item.MICRO_CHIP = "MICRO_CHIP";

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