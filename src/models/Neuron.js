(function (ng) {
    'use strict';

    ng.module('aidemo.models.neuron', [])
        .factory('Neuron', [
            function () {
                function Neuron(params) {
                    params = params || {};
                }

                return Neuron;
            }
        ]);
})(angular);