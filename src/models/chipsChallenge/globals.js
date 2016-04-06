(function (ng) {
    'use strict';

    angular.module('aidemo.models.chip.globals', [
        'aidemo.models.vector'
    ])

    /**
     * Globally known variables common to multiple models.
     * This is a service and not a value purely because it has dependencies.
     */
        .service('Globals', ['Vector', function (Vector) {
            var globals = this;

            /**
             * Tile Size
             */
            globals.TILE_SIZE = 64;

            /**
             * Cardinal Directions
             */
            globals.UP = new Vector({y: -globals.TILE_SIZE});
            globals.DOWN = new Vector({y: globals.TILE_SIZE});
            globals.LEFT = new Vector({x: -globals.TILE_SIZE});
            globals.RIGHT = new Vector({x: globals.TILE_SIZE});

            /**
             * Status Types
             */
            globals.DEAD = 'DEAD';
            globals.ALIVE = 'ALIVE';
            globals.COMPLETE = 'COMPLETE';
        }]);

})(angular);
