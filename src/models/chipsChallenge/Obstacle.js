(function (ng) {
    'use strict';

    ng.module('aidemo.models.chip.obstacle', [
        'aidemo.service.utils',
        'aidemo.service.drawUtils'
    ])
        .factory('Obstacle', ['Utils', 'DrawUtils',
        function (Utils, DrawUtils) {

            /**
             * Class that represents the various obstacles in the world that the player can interact with
             * @param params - Object with options, MUST HAVE A 'type' PROPERTY
             * @constructor
             */
            function Obstacle(params) {
                params = params || {};

                if (!params.type) {
                    throw new Error("ERROR INSTANTIATING OBSTACLE: MUST HAVE A TYPE");
                }

                this.type = params.type;
                this.image = Utils.generateImageFromURLObject(Obstacle.OBSTACLE_IMAGES, this.type);
            }

            /**
             * A collection of image URLs related to Obstacle type
             */
            var obstacleRoot = "images/chipsChallenge/obstacles/";
            Obstacle.OBSTACLE_IMAGES = {
                CHIP_DOOR: obstacleRoot + "chipDoorLarge.png",
                PUSH_BLOCK: obstacleRoot + "pushBlockLarge.png",
                BLUE_DOOR: obstacleRoot + "blueDoorLarge.png",
                GREEN_DOOR: obstacleRoot + "greenDoorLarge.png",
                RED_DOOR: obstacleRoot + "redDoorLarge.png",
                YELLOW_DOOR: obstacleRoot + "yellowDoorLarge.png"
            };

            /**
             * Obstacle type constants, anything can use Obstacle.{OBSTACLETYPE}
             */
            Obstacle.DOOR = "DOOR";
            Obstacle.KEY = "KEY";
            Obstacle.CHIP_DOOR = "CHIP_DOOR";
            Obstacle.PUSH_BLOCK = "PUSH_BLOCK";
            Obstacle.BLUE_DOOR = "BLUE_DOOR";
            Obstacle.GREEN_DOOR = "GREEN_DOOR";
            Obstacle.RED_DOOR = "RED_DOOR";
            Obstacle.YELLOW_DOOR = "YELLOW_DOOR";

            Obstacle.prototype.isColoredDoor = function () {
                return this.type !== Obstacle.CHIP_DOOR && this.type.slice(-4) === Obstacle.DOOR;
            };

            Obstacle.prototype.doorToKey = function () {
                var res = this.type.split(Obstacle.DOOR);
                res.push(Obstacle.KEY);
                return res.join('');
            };

            /**
             * Returns this Obstacle's type property
             * @returns {string}
             */
            Obstacle.prototype.getType = function () {
                return this.type;
            };


            Obstacle.prototype.update = function () {
            };

            /**
             * Given a canvas context, an X pos, and a Y pos, calls DrawUtils to render this Obstacle's image
             * @param context - Canvas element's context property
             * @param x - x position to draw the image at
             * @param y - y position to draw the image at
             */
            Obstacle.prototype.render = function (context, x, y) {
                DrawUtils.drawImage(context, x, y, this.image);
            };

            return Obstacle;
        }]);
})(angular);