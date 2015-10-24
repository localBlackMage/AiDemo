angular.module('aidemo.ui.canvas', [
    'aidemo.service.drawUtils',
    'aidemo.models.vector'
])
    .directive('canvasScreen', ['$window', '$interval', '$timeout', 'DrawUtils', 'Vector',
        function ($window, $interval, $timeout, DrawUtils, Vector) {
            return {
                restrict: 'E',
                replace: true,
                scope: {
                    hasGrid: '@',
                    bgColor: '@',
                    box: '=',
                    gridColor: '@?',
                    gridSpacing: '=?',
                    height: '=?',
                    width: '=?',
                    minHeight: '=?',
                    minWidth: '=?',
                    objects: '=?',
                    onUpdate: '&?'
                },
                link: function (scope, element, attributes) {
                    scope.canvasContext = {};
                    scope.requestID = null;

                    /**
                     * Resizes the canvas and sets the box object before calling scope.$apply()
                     */
                    scope.resizeHandler = function () {
                        scope.resizeCanvasAndSetBox();
                        scope.$apply();
                    };

                    /**
                     * If the object has a render function, calls it passing the canvasContext as
                     * an argument
                     * @param object - JS Object
                     */
                    scope.renderObject = function (object) {
                        if (_.isFunction(object.render)) {
                            object.render(scope.canvasContext);
                        }
                    };

                    /**
                     * Iterates over the properties of the given object, for each that is an array,
                     * calls scope.renderArrayOrObjectsArrays with the array as an argument
                     * @param object - JS Object to iterate over
                     */
                    scope.renderArraysInObject = function (object) {
                        for (var property in object) {
                            if (object.hasOwnProperty(property)) {
                                scope.renderArrayOrObjectsArrays(object[property]);
                            }
                        }
                    };

                    /**
                     * Given an Array, iterates over each object and calls scope.renderObject with
                     * the object as an argument
                     * Given a JS Object, calls scope.renderArraysInObject with the JS Object as an
                     * argument
                     * @param objects - Array of objects OR JS Object
                     */
                    scope.renderArrayOrObjectsArrays = function (objects) {
                        if (_.isArray(objects)) {
                            objects.forEach(scope.renderObject);
                        }
                        else {
                            scope.renderArraysInObject(objects);
                        }
                    };

                    /**
                     * Calls DrawUtils.drawGrid if this directive has a grid
                     */
                    scope.renderGrid = function () {
                        if (scope.hasGrid) {
                            DrawUtils.drawGrid(scope.canvasContext, scope.box, scope.gridSpacing, scope.gridColor);
                        }
                    };

                    /**
                     * Erases the canvas with the bgColor, draws a grid if hasGrid is true, calls each
                     * object's render function within scope.objects
                     */
                    scope.render = function () {
                        DrawUtils.fillCanvas(scope.canvas, scope.bgColor);

                        scope.renderGrid();

                        scope.renderArrayOrObjectsArrays(scope.objects);
                    };

                    /**
                     * Calls render and requests a new frame
                     */
                    scope.animate = function () {
                        if (_.isFunction(scope.onUpdate)) {
                            scope.onUpdate();
                        }
                        scope.render();
                        console.log("Called");

                        // request new frame
                        scope.requestID = $window.requestAnimationFrame(scope.animate);
                        //$window.requestAnimFrame(scope.animate);
                    };

                    /**
                     * If there is a height and minHeight property and the height is
                     * less than the minHeight, sets height to the minHeight
                     * If there is a width and minWidth property and the width is
                     * less than the minWidth, sets width to the minWidth
                     */
                    scope.setHeightAndWidthFromMinimumValues = function () {
                        if (_.isNumber(scope.height) && _.isNumber(scope.minHeight) && scope.height < scope.minHeight) {
                            scope.height = scope.minHeight;
                        }

                        if (_.isNumber(scope.width) && _.isNumber(scope.minWidth) && scope.width < scope.minWidth) {
                            scope.width = scope.minWidth;
                        }
                    };

                    /**
                     * Creates an object on the scope named box with a width, height,
                     * and center property for ease of reference
                     * @param height - Number, height of the canvas element
                     * @param width - Number, width of the canvas element
                     */
                    scope.setBoxObject = function (height, width) {
                        scope.box = {
                            width: width,
                            height: height,
                            center: new Vector({x: width / 2, y: height / 2})
                        };
                    };

                    /**
                     * Given the parentElement, if there is a height on the scope,
                     * sets the canvas and containing element height to that
                     * If there is none, sets the height to the parent's offsetHeight
                     * @param parentElement - Angular Element object containing this directive
                     */
                    scope.setCanvasHeight = function (parentElement) {
                        if (_.isNumber(scope.height)) {
                            element.css('height', scope.height + 'px');
                            scope.canvas.height = scope.height;
                        }
                        else if (parentElement) {
                            element.css('height', parentElement.offsetHeight + 'px');
                            scope.canvas.height = parentElement.offsetHeight;
                        }
                    };

                    /**
                     * Given the parentElement, if there is a width on the scope,
                     * sets the canvas and containing element width to that
                     * If there is none, sets the width to the parent's offsetWidth
                     * @param parentElement - Angular Element object containing this directive
                     */
                    scope.setCanvasWidth = function (parentElement) {
                        if (_.isNumber(scope.width)) {
                            element.css('width', scope.width + 'px');
                            scope.canvas.width = scope.width;
                        }
                        else if (parentElement) {
                            element.css('width', parentElement.offsetWidth + 'px');
                            scope.canvas.width = parentElement.offsetWidth;
                        }
                    };

                    /**
                     * Sets element and canvas height and width properties
                     * Calls setBoxObject to create the scope's box property
                     */
                    scope.resizeCanvasAndSetBox = function () {
                        var parent = angular.element(element.parent())[0];
                        scope.setCanvasHeight(parent);
                        scope.setCanvasWidth(parent);

                        scope.setBoxObject(scope.canvas.height, scope.canvas.width);
                    };

                    /**
                     * Adds an event listener to the window's resize event is debounced
                     * by 100 milliseconds
                     */
                    scope.setupResizeHandler = function () {
                        // This is borrowed from resize.js
                        var w = angular.element($window),
                            lazyResizeHandler;

                        // for resize events, we debounce the resizeHandler so that we are not
                        // resizing the window on every event
                        lazyResizeHandler = _.debounce(scope.resizeHandler, 100);

                        w.on('resize', lazyResizeHandler);

                        //resize whenever a page is finished loading, we use the lazy reload
                        //to ensure the rendering is fully complete.
                        scope.$on('$viewContentLoaded', lazyResizeHandler);
                    };

                    element.on('$destroy', function () {
                        // CANCEL THE INTERVAL
                        $window.cancelAnimationFrame(scope.requestID);
                    });

                    /**
                     * Setup function
                     */
                    (function () {
                        /**
                         * Given the scope's hasGrid property, compares it to a list of acceptable 'true' strings and
                         * returns the result
                         * @param hasGrid - String, scope's hasGrid property
                         * @returns {boolean} - True if hasGrid is an acceptable 'true' string, false if not
                         */
                        function getHasGrid(hasGrid) {
                            var gridStringArray = ['t', 'true', 'yes', 'y'];
                            return _.findIndex(gridStringArray, function (gridString) {
                                    return gridString === hasGrid.toLowerCase();
                                }) > -1;
                        }

                        scope.hasGrid = getHasGrid(scope.hasGrid);
                        scope.gridSpacing = scope.gridSpacing ? scope.gridSpacing : 20;
                        scope.objects = scope.objects ? scope.objects : [];

                        scope.setHeightAndWidthFromMinimumValues();

                        scope.canvas = element[0];
                        scope.canvasContext = scope.canvas.getContext('2d');
                        scope.resizeCanvasAndSetBox();

                        /**
                         * If there is no height or width property specified, the canvas will become responsively sized
                         * to the parent element
                         */
                        if (!_.isNumber(scope.height) || !_.isNumber(scope.width)) {
                            scope.setupResizeHandler();
                        }


                        var lastTime = 0;
                        var vendors = ['ms', 'moz', 'webkit', 'o'];
                        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                            $window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
                            $window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
                                || window[vendors[x] + 'CancelRequestAnimationFrame'];
                        }

                        if (!$window.requestAnimationFrame) {
                            $window.requestAnimationFrame = function (callback, element) {
                                var currTime = new Date().getTime();
                                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                                var id = $timeout(function () {
                                        callback(currTime + timeToCall);
                                    },
                                    timeToCall);
                                lastTime = currTime + timeToCall;
                                return id;
                            };
                        }

                        if (!$window.cancelAnimationFrame) {
                            $window.cancelAnimationFrame = function (id) {
                                clearTimeout(id);
                            };
                        }

                        scope.requestID = $window.requestAnimationFrame(scope.animate);
                    })();

                    scope.requestAnimFrameFunction = function (callback) {
                        return $timeout(callback, 1000 / 60);
                    };

                    //// Animation
                    //$window.requestAnimFrame = (function (callback) {
                    //    //var lastTime = 0;
                    //    //var fn = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || scope.requestAnimFrameFunction;
                    //    //if (!fn) {
                    //    //    fn = function (callback, element) {
                    //    //        var currTime = new Date().getTime();
                    //    //        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                    //    //        var id = window.setTimeout(function () {
                    //    //                callback(currTime + timeToCall);
                    //    //            },
                    //    //            timeToCall);
                    //    //        lastTime = currTime + timeToCall;
                    //    //        return id;
                    //    //    };
                    //    //}
                    //    //return fn;
                    //
                    //    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || scope.requestAnimFrameFunction;
                    //})();
                    //
                    //$window.cancelAnimationFrame = (function (callback) {
                    //    if (window.cancelAnimationFrame) {
                    //        return window.cancelAnimationFrame;
                    //    }
                    //    var fn, vendors = ['ms', 'moz', 'webkit', 'o'];
                    //
                    //    for (var x = 0; x < vendors.length; ++x) {
                    //        fn = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
                    //    }
                    //    if (!fn) {
                    //        fn = function (id) {
                    //            clearTimeout(id);
                    //        };
                    //    }
                    //    return fn;
                    //})();
                    //
                    //if (!$window.cancelAnimationFrame) {
                    //    $window.cancelAnimationFrame = function (id) {
                    //        scope.clearTimeout(id);
                    //    };
                    //}

                    //$interval(scope.animate, 0);

                },
                template: '<canvas class="screen"></canvas>'
            }
        }]);
