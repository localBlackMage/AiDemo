(function (ng) {
    'use strict';

    ng.module('aidemo.models.neuron', [])
        .factory('Neuron', ['Utils', 'DrawUtils',
            function (Utils, DrawUtils) {
                /**
                 * Constructor, with class name
                 */
                function Neuron(params) {
                }

                Neuron.build = function (data) {
                    return new Neuron(data);
                };

                Neuron.prototype.update = function () {

                };

                Neuron.prototype.render = function () {

                };

                return Neuron;
            }
        ]);
})(angular);