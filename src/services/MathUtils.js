(function (ng) {
    'use strict';
    ng.module('aidemo.service.mathUtils', [])
        .service('MathUtils', ['$window',
            function ($window) {
                var self = this;
                /**
                 * Given two objects, compares them and returns true if they're the same object
                 * @param firstObject - Object
                 * @param secondObject - Object
                 * @returns {boolean} - True if the objects are two references to the same object in memory
                 * @private
                 */
                this._isSameObject = function (firstObject, secondObject) {
                    return firstObject === secondObject;
                };

                /**
                 * Given two objects with position properties and a tolerance, calculates the distance between the
                 * two object's positions and compares it to the tolerance
                 * If the objects are not the same and don't have identical positions and the distance is equal to or
                 * less than the tolerance, returns True
                 * @param originObject - Object with position property
                 * @param otherObject - Object with position property
                 * @param tolerance - Number, acceptable distance to be considered "near enough"
                 * @returns {boolean} - True if the otherObject is close enough to the originObject, false if not
                 * @private
                 */
                this._isDistanceWithinTolerance = function (originObject, otherObject, tolerance) {
                    if (self._isSameObject(originObject, otherObject)) {
                        return false;
                    }

                    try {
                        return originObject.position.distance(otherObject.position) <= tolerance;
                    }
                    catch (e) {
                        $window.alert(e);
                        return false;
                    }
                };

                /**
                 * Given a minimum and maximum value, generates a random number between those two inclusively
                 * @param min
                 * @param max
                 * @returns {Number}
                 */
                this.getRandomNumber = function (min, max) {
                    return Math.random() * (max - min) + min;
                };

                /**
                 * Given an array of objects, an origin object, and a tolerance, returns an array of objects whose
                 * positions are within the tolerance distance of the origin object
                 * @param arrayOfObjects
                 * @param originObject
                 * @param tolerance
                 * @returns {*}
                 */
                this.getNearestObjects = function (arrayOfObjects, originObject, tolerance) {
                    return arrayOfObjects.reduce(function (array, otherObject) {
                        return self._isDistanceWithinTolerance(originObject, otherObject, tolerance) ? array.concat(otherObject) : array;
                    }, []);
                };

                //return {
                //    _isDistanceWithinTolerance: _isDistanceWithinTolerance,
                //    _isSameObject: _isSameObject,
                //
                //    getRandomNumber: getRandomNumber,
                //    getNearestObjects: getNearestObjects
                //};
            }
        ]);
})(angular);