demoApp.controller('LifeCtrl', ['$scope', function ($scope) {
    // Common Objects/Definitions
    var CAN_BACK = "#222", GRID_COLOR = "#555";

    // Scope Fields
    $scope.canvas = $('#lifeCanvas')[0];
    $scope.box = {
        width: $scope.canvas.width,
        height: $scope.canvas.height,
        center: New(Vector, {x: $scope.canvas.width / 2, y: $scope.canvas.height / 2})
    };
    $scope.ctx = $scope.canvas.getContext('2d');
    $scope.generation = 1;
    $scope.step = 0.25;
    $scope.pause = false;
    $scope.gridObj = {
        grid: [],
        tileSize: 10
    };

    // Scope Functions
    $scope.generateGrid = function() {
        var de;
        $scope.gridObj = {
            grid: [],
            tileSize: 10
        };
        for(var y = 0; y < $scope.box.height / $scope.gridObj.tileSize; y++) {
            var arr = [];
            for(var x = 0; x < $scope.box.width / $scope.gridObj.tileSize; x++) {
                de = MathUtils.getRandomNumber(0, 1) < 0.1 ? true : false;
                arr.push((New(Cell, {
                    box: {
                        x: x * $scope.gridObj.tileSize,
                        y: y * $scope.gridObj.tileSize,
                        width: $scope.gridObj.tileSize,
                        height: $scope.gridObj.tileSize
                    },
                    status: de ? ALIVE : DEAD
                })));
            }
            $scope.gridObj.grid.push(arr);
        }
        fillNeighbors($scope.gridObj.grid);
    };

    $scope.update = function () {
        $scope.generation++;
        var copy = deepCopyGrid($scope.gridObj.grid);
        for(var y = 0; y < $scope.gridObj.grid.length; y++) {
            for(var x = 0; x < $scope.gridObj.grid[y].length; x++) {
                $scope.gridObj.grid[y][x].setStatus( copy[y][x].update() );
            }
        }
    };

    $scope.render = function () {
        DrawUtils.fillCanvas($scope.canvas, CAN_BACK);
        $scope.gridObj.grid.forEach(function(row) {
            row.forEach(function(node) {
                node.render($scope.ctx);
            });
        });

        DrawUtils.drawGrid($scope.ctx, $scope.box, $scope.gridObj.tileSize, GRID_COLOR);
    };

    $scope.reset = function() {
        $scope.generateGrid();
        $scope.generation = 1;
        $scope.render();
    };

    $scope.getPause = function() {
        if ($scope.pause)
            return "Resume";
        else
            return "Pause";
    };

    $scope.pauseToggle = function() {
        $scope.pause = !$scope.pause;
    };

    $scope.spawnCell = function(x, y) {
        var newX = Math.round(x / $scope.gridObj.tileSize) - 1,
            newY = Math.round(y / $scope.gridObj.tileSize) - 1;
        $scope.gridObj.grid[newY][newX].setStatus(ALIVE);
        $scope.render();
    };

    // Setup
    $scope.generateGrid();

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

demoApp.directive('ngCanvas', function () {
    return {
        restrict: "A",
        link: function (scope, element) {
            var drawing = false;
            element.bind('mousedown', function (event) {
                scope.spawnCell(event.offsetX - 1, event.offsetY - 1);
                drawing = true;
            });
            element.bind('mousemove', function (event) {
                if (drawing)
                    scope.spawnCell(event.offsetX - 1, event.offsetY - 1);
            });
            element.bind('mouseup', function (event) {
                drawing = false;
            });
        }
    };
});

