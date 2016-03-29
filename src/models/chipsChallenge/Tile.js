(function (ng) {
    'use strict';

    ng.module('aidemo.models.chip.tile', [
        'aidemo.service.drawUtils'
    ])
        .factory('Tile', ['DrawUtils'], function (DrawUtils) {


            function Tile(params) {
                params = params || {};

                this.type = params.type ? params.type : this.params.type;
                this.worldPos = params.worldPos ? params.worldPos : this.params.worldPos;
                this.screenPos = params.screenPos ? params.screenPos : this.params.screenPos;
                this.image = this.createImage(this.type);
                this.item = params.item ? params.item : this.params.item;
                this.obstacle = params.obstacle ? params.obstacle : this.params.obstacle;
                this.neighbors = params.neighbors ? params.neighbors : this.params.neighbors;
            }

            var tileRoot = "images/chipsChallenge/tiles/";
            Tile.TILE_IMAGES = {
                EMPTY: tileRoot + "emptyLarge.png",
                BLOCK: tileRoot + "blockLarge.png",
                WATER_BLOCK: tileRoot + "waterBlockLarge.png",
                WATER: tileRoot + "waterLarge.png",
                FIRE: tileRoot + "fireLarge.png",
                ROLLER: tileRoot + "ROLLER",
                ICE: tileRoot + "iceLarge.png",
                ICE_LD: tileRoot + "iceLDLarge.png",
                ICE_RD: tileRoot + "iceRDLarge.png",
                ICE_LU: tileRoot + "iceLULarge.png",
                ICE_RU: tileRoot + "iceRULarge.png",
                EXIT: tileRoot + "exitLarge.png"
            };

            Tile.EMPTY = "EMPTY";
            Tile.BLOCK = "BLOCK";
            Tile.WATER_BLOCK = "WATER_BLOCK";
            Tile.WATER = "WATER";
            Tile.FIRE = "FIRE";
            Tile.ROLLER = "ROLLER";
            Tile.ICE = "ICE";
            Tile.ICE_LD = "ICE_LD";
            Tile.ICE_RD = "ICE_RD";
            Tile.ICE_LU = "ICE_LU";
            Tile.ICE_RU = "ICE_RU";
            Tile.EXIT = "EXIT";

            Tile.prototype.getNeighborInDir = function (dir) {
                dir = dir.length() !== 64 ? dir.mulNew(64) : dir;
                var which = this.worldPos.addNew(dir);
                for (var idx = 0; idx < this.neighbors.length; idx++) {
                    if (which.compare(this.neighbors[idx].worldPos)) {
                        return this.neighbors[idx];
                    }
                }
            };

            Tile.prototype.getNeighbors = function () {
                return this.neighbors;
            };

            Tile.prototype.fillNeighbors = function (neighbors) {
                this.neighbors = neighbors ? neighbors : [];
            };

            Tile.prototype.createImage = function (type) {
                var image = new Image();
                image.src = Tile.TILE_IMAGES[type];
                return image;
            };

            Tile.prototype.move = function (dir) {
                this.screenPos.add(dir);
            };

            Tile.prototype.removeItem = function () {
                this.item = null;
            };

            Tile.prototype.getItem = function () {
                return this.item;
            };

            Tile.prototype.removeObstacle = function () {
                this.obstacle = null;
            };

            Tile.prototype.getObstacle = function () {
                return this.obstacle;
            };

            Tile.prototype.setObstacle = function (obstacle) {
                this.obstacle = obstacle;
            };

            Tile.prototype.getType = function () {
                return this.type;
            };

            Tile.prototype.setType = function (type) {
                this.type = type;
                this.image = this.createImage(this.type);
            };

            Tile.prototype._iceGetDir = function (type) {
                return type.split(Tile.ICE, '_');
            };

            Tile.prototype.iceGetDir = function (curDir) {
                if (this.type === Tile.ICE) {
                    return curDir;
                }

            };

            Tile.prototype.update = function () {
            };

            Tile.prototype._renderItem = function (ctx) {
                if (this.item !== null) {
                    this.item.render(ctx, this.screenPos.x, this.screenPos.y);
                }
            };

            Tile.prototype._renderObstacle = function (ctx) {
                if (this.obstacle !== null) {
                    this.obstacle.render(ctx, this.screenPos.x, this.screenPos.y);
                }
            };

            Tile.prototype.render = function (ctx) {
                DrawUtils.drawImage(ctx, this.screenPos.x, this.screenPos.y, this.image);
                this._renderItem(ctx);
                this._renderObstacle(ctx);
            };
        });
})(angular);