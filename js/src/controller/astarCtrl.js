demoApp.controller('AstarCtrl', ['$scope', function ($scope) {
    // Common Objects/Definitions
    var CAN_BACK = "#222", GRID_COLOR = "#555", GRID_SIZE = 50;

    // Scope Fields
    $scope.canvas = $('#astarCanvas')[0];
    $scope.box = {
        width: $scope.canvas.width,
        height: $scope.canvas.height,
        center: New(Vector, {x: $scope.canvas.width / 2, y: $scope.canvas.height / 2})
    };
    $scope.ctx = $scope.canvas.getContext('2d');
    $scope.step = 0.25;
    $scope.pause = false;
    $scope.gridObj = {
        grid: [],
        tileSize: GRID_SIZE
    };
    $scope.start = null;
    $scope.end = null;

    // Scope Functions
    $scope.markPath = function(path) {
        while(!path.isEmpty()) {
            var node = path.dequeue();
            node.pathSelect();
        }
    };

    $scope.detect = function(pos) {
        if ($scope.start === null) {
            $scope.gridObj.grid.forEach(function (row) {
                row.forEach(function (node) {
                    if (node) {
                        node.resetSelect();
                        if (node.specialSelect(pos)) {
                            $scope.start = node;
                        }
                    }
                });
            });

            if ($scope.start) {
                DFS($scope.start, 5);
            }
        }
        else if ($scope.end === null){
            $scope.gridObj.grid.forEach(function (row) {
                row.forEach(function (node) {
                    if (node && node.selected && !node.special) {
                        if (node.specialSelect(pos)) {
                            $scope.end = node;
                        }
                    }
                });
            });
            $scope.markPath(A_Star($scope.start, $scope.end, $scope.gridObj.grid));
        }
        else {
            $scope.start = null;
            $scope.end = null;
        }
    };

    $scope.generateGrid = function() {
        var curId = 0,
            tCalc = $scope.gridObj.tileSize / 2;
        $scope.gridObj = {
            grid: [],
            tileSize: GRID_SIZE
        };
        for(var y = 0; y < $scope.box.height / $scope.gridObj.tileSize; y++) {
            var arr = [];
            for(var x = 0; x < $scope.box.width / $scope.gridObj.tileSize; x++) {
                var spawn = MathUtils.getRand(0, 1) < 0.8 ? true : false;
                if (spawn) {
                    var pos = New(Vector, {
                        x: x * $scope.gridObj.tileSize + tCalc,
                        y: y * $scope.gridObj.tileSize + tCalc
                    });
                    arr.push((New(Node, {
                        box: {
                            x: x * $scope.gridObj.tileSize,
                            y: y * $scope.gridObj.tileSize,
                            width: $scope.gridObj.tileSize,
                            height: $scope.gridObj.tileSize
                        },
                        id: curId.toString(),
                        pos: pos
                    })));
                }
                else {
                    arr.push(null);
                }
                curId++;
            }
            $scope.gridObj.grid.push(arr);
        }
        fillNeighbors($scope.gridObj.grid, true);
    };

    $scope.update = function () {

    };

    $scope.render = function () {
        DrawUtils.fillCanvas($scope.canvas, CAN_BACK);
        DrawUtils.drawGrid($scope.ctx, $scope.box, GRID_SIZE, GRID_COLOR);

        $scope.gridObj.grid.forEach(function(row) {
            row.forEach(function(node) {
                if (node)
                    node.renderPaths($scope.ctx);
            });
        });

        $scope.gridObj.grid.forEach(function(row) {
            row.forEach(function(node) {
                if (node)
                    node.render($scope.ctx);
            });
        });
    };

    // Setup
    $scope.generateGrid();

    var test = function() {
        for (var row = 0; row < $scope.gridObj.grid.length; row++) {
            for (var col = 0; col < $scope.gridObj.grid[row].length; col++) {
                if ($scope.gridObj.grid[row][col]) {
                    $scope.gridObj.grid[row][col].special = true;
                    DFS($scope.gridObj.grid[row][col], 5);
                    return;
                }
            }
        }
    };
    test();

    // Animation
    window.requestAnimFrame = (function (callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    $scope.animate = function (startTime) {
        var time = (new Date()).getTime() - startTime;
        if (time > $scope.step * 1000 && !$scope.pause) {
            startTime = (new Date()).getTime();
            $scope.update();
            $scope.render();
            $scope.$apply();
        }
        else if ($scope.pause) {
            startTime = (new Date()).getTime();
        }
        // request new frame
        requestAnimFrame(function () {
            $scope.animate(startTime);
        });
    };

    setTimeout(function () {
        var startTime = (new Date()).getTime();
        $scope.animate(startTime);
    }, 0);
}]);

demoApp.directive('ngCanvasAi', function () {
    return {
        restrict: "A",
        link: function (scope, element) {
//            var drawing = false;
            element.bind('mousedown', function (event) {
                scope.detect(New(Vector, {x: event.offsetX - 1, y: event.offsetY - 1}));
//                drawing = true;
            });
//            element.bind('mousemove', function (event) {
//                if (drawing)
//                    scope.detect(New(Vector, {x: event.offsetX - 1, y: event.offsetY - 1}));
//            });
            element.bind('mouseup', function (event) {
//                drawing = false;
            });
        }
    };
});