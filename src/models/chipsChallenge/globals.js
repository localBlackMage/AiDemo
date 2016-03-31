(function (ng) {
    'use strict';

    angular.module('aidemo.models.chip.globals', [
        'aidemo.models.vector'
    ])

    /**
     * Globally known variables common to multiple models.
     * This is a service and not a value purely because it has dependencies.
     */
        .service('Globals', ['Vector'], function (Vector) {
            var globals = this;

            /**
             * Cardinal Directions
             */
            globals.UP = new Vector({y: -64});
            globals.DOWN = new Vector({y: 64});
            globals.LEFT = new Vector({x: -64});
            globals.RIGHT = new Vector({x: 64});

            /**
             * Status Types
             */
            globals.DEAD = 'DEAD';
            globals.ALIVE = 'ALIVE';
            globals.COMPLETE = 'COMPLETE';
        });

})(angular);
