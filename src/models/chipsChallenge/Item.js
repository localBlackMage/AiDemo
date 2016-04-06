(function (ng) {
    'use strict';

    ng.module('aidemo.models.chip.item', [
        'aidemo.service.utils',
        'aidemo.service.drawUtils'
    ])
        .factory('Item', ['Utils', 'DrawUtils',
            function (Utils, DrawUtils) {

                /**
                 * Class that represents the various items in the world for the player to interact with
                 * @param params - Object with options, MUST HAVE A 'type' PROPERTY
                 * @constructor
                 */
                function Item(params) {
                    params = params || {};

                    if (!params.type) {
                        throw new Error("ERROR INSTANTIATING ITEM: MUST HAVE A TYPE");
                    }

                    this.type = params.type;
                    this.image = Utils.generateImageFromURLObject(Item.ITEM_IMAGES, this.type);
                }

                /**
                 * A collection of image URLs related to Item type
                 */
                var itemRoot = "images/chipsChallenge/items/";
                Item.ITEM_IMAGES = {
                    FLIPPERS: itemRoot + "flippersLarge.png",
                    FIRE_BOOTS: itemRoot + "fireBootsLarge.png",
                    ROLLER_SKATES: itemRoot + "rollerSkatesLarge.png",
                    ICE_SKATES: itemRoot + "iceSkatesLarge.png",
                    BLUE_KEY: itemRoot + "blueKeyLarge.png",
                    RED_KEY: itemRoot + "redKeyLarge.png",
                    GREEN_KEY: itemRoot + "greenKeyLarge.png",
                    YELLOW_KEY: itemRoot + "yellowKeyLarge.png",
                    MICRO_CHIP: itemRoot + "microChipLarge.png"
                };

                /**
                 * Item type constants, anything can use Item.{ITEMTYPE}
                 */
                Item.FLIPPERS = "FLIPPERS";
                Item.FIRE_BOOTS = "FIRE_BOOTS";
                Item.ROLLER_SKATES = "ROLLER_SKATES";
                Item.ICE_SKATES = "ICE_SKATES";
                Item.BLUE_KEY = "BLUE_KEY";
                Item.RED_KEY = "RED_KEY";
                Item.GREEN_KEY = "GREEN_KEY";
                Item.YELLOW_KEY = "YELLOW_KEY";
                Item.MICRO_CHIP = "MICRO_CHIP";

                /**
                 * Returns true if this Item's type is Item.MICRO_CHIP, false if not
                 * @returns {boolean}
                 */
                Item.prototype.isMicrochip = function () {
                    return this.type === Item.MICRO_CHIP;
                };

                /**
                 * Returns this Item's type property
                 * @returns {string}
                 */
                Item.prototype.getType = function () {
                    return this.type;
                };


                Item.prototype.update = function () {
                };

                /**
                 * Given a canvas context, an X pos, and a Y pos, calls DrawUtils to render this Item's image
                 * @param context - Canvas element's context property
                 * @param x - x position to draw the image at
                 * @param y - y position to draw the image at
                 */
                Item.prototype.render = function (context, x, y) {
                    DrawUtils.drawImage(context, x, y, this.image);
                };

                return Item;
            }]);
})(angular);