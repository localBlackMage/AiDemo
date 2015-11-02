describe('A Star Controller', function () {
    'use strict';

    var scope, timeout, AStar, GridService, MathUtils, Vector, Node, Queue;

    beforeEach(function () {
        module('aidemo.astar', 'aidemo.models.queue');

        inject(function ($controller, $rootScope, $timeout, _AStar_, _GridService_, _MathUtils_, _Vector_, _Node_, _Queue_, $injector) {
            scope = $rootScope.$new();
            timeout = $timeout;
            AStar = $injector.get('AStar');
            GridService = $injector.get('GridService');
            MathUtils = $injector.get('MathUtils');
            Vector = _Vector_;
            Node = _Node_;
            Queue = _Queue_;

            $controller('AStarController', {
                $scope: scope,
                $timeout: timeout,
                AStar: AStar,
                GridService: GridService,
                MathUtils: MathUtils,
                Vector: Vector,
                Node: Node
            });
        });

        spyOn(scope, '$emit');
    });

    it("should have certain properties on the scope", function () {
        expect(scope.BACK_COLOR).toBe("#555555");
        expect(scope.GRID_COLOR).toBe("#8EAEC9");
        expect(scope.gridObj.grid).toBeDefined();
        expect(scope.gridObj.grid.length).toBe(0);
        expect(scope.gridObj.tileSize).toBe(50);
        expect(scope.start).toBe(null);
        expect(scope.end).toBe(null);
    });


    it("should mark nodes in a path", function () {
        var node = new Node(),
            queue = new Queue();

        queue.enqueue(node);

        spyOn(queue, 'isEmpty').and.callThrough();
        spyOn(queue, 'dequeue').and.callThrough();
        spyOn(node, 'pathSelect').and.callFake(function () {});

        scope.markPath(null);

        expect(queue.isEmpty).not.toHaveBeenCalled();
        expect(queue.dequeue).not.toHaveBeenCalled();
        expect(node.pathSelect).not.toHaveBeenCalled();

        scope.markPath(queue);

        expect(queue.isEmpty).toHaveBeenCalled();
        expect(queue.dequeue).toHaveBeenCalled();
        expect(node.pathSelect).toHaveBeenCalled();
    });

    it("should create a path if there is a start and end node", function () {
        var aStarPath = [];

        scope.start = null;
        scope.end = null;

        spyOn(AStar, 'aStarAlgorithm').and.callFake(function (start, end, grid, dist) {
            expect(start).toBe(scope.start);
            expect(end).toBe(scope.end);
            expect(grid).toBe(scope.gridObj.grid);
            expect(dist).toBe(scope.gridObj.tileSize);

            return aStarPath;
        });
        spyOn(scope, 'markPath').and.callFake(function (path) {
            expect(path).toBe(aStarPath);
        });

        scope.createPath();

        expect(AStar.aStarAlgorithm).not.toHaveBeenCalled();
        expect(scope.markPath).not.toHaveBeenCalled();


        scope.start = new Node();
        scope.end = new Node();

        scope.createPath();

        expect(AStar.aStarAlgorithm).toHaveBeenCalled();
        expect(scope.markPath).toHaveBeenCalled();
    });

    it("should select an eligible start node and highlight eligible end nodes", function () {
        var node1 = new Node(),
            node2 = new Node(),
            position = new Vector();
        scope.gridObj.grid = [[null, node1, node2]];

        spyOn(AStar, 'depthFirstSearch').and.callFake(function (start, range) {
            expect(start).toBe(node2);
            expect(range).toBe(5);
        });

        spyOn(node1, 'specialSelect').and.callFake(function (pos) {
            expect(pos).toBe(position);
            return false;
        });
        spyOn(node1, 'reset').and.callFake(function () {
        });

        spyOn(node2, 'specialSelect').and.callFake(function (pos) {
            expect(pos).toBe(position);
            return true;
        });
        spyOn(node2, 'reset').and.callFake(function () {
        });

        scope.selectStartNode(position);

        expect(node1.specialSelect.calls.count()).toBe(1);
        expect(node1.reset.calls.count()).toBe(1);
        expect(node2.specialSelect.calls.count()).toBe(1);
        expect(node2.reset.calls.count()).toBe(1);
        expect(scope.start).toBe(node2);
        expect(AStar.depthFirstSearch.calls.count()).toBe(1);
    });

    it("should select an eligible end node and call createPath", function () {
        var node = new Node(),
            position = new Vector();
        scope.gridObj.grid = [[null]];

        spyOn(scope, 'createPath').and.callFake(function () {
        });
        spyOn(node, 'eligibleForSelect').and.callFake(function (pos) {
            expect(pos).toBe(position);
            return true;
        });

        scope.selectEndNode(position);

        expect(scope.createPath.calls.count()).toBe(1);


        scope.gridObj.grid = [[node]];

        scope.selectEndNode(position);

        expect(scope.createPath.calls.count()).toBe(2);
        expect(node.eligibleForSelect.calls.count()).toBe(1);
        expect(scope.end).toBe(node);
    });

    it("should reset", function () {
        var node = new Node();

        scope.start = {};
        scope.end = {};
        scope.gridObj.grid = [[node]];

        spyOn(node, 'reset').and.callFake(function () {
        });

        scope.reset();

        expect(node.reset).toHaveBeenCalled();
        expect(scope.start).toBe(null);
        expect(scope.end).toBe(null);
    });

    it("should handle a touch position", function () {
        var position = new Vector();

        spyOn(scope, 'selectStartNode').and.callFake(function (pos) {
            expect(pos).toBe(position);
        });
        spyOn(scope, 'selectEndNode').and.callFake(function (pos) {
            expect(pos).toBe(position);
        });
        spyOn(scope, 'reset').and.callFake(function () {
        });


        scope.start = null;
        scope.handleTouchPosition(position);

        expect(scope.selectStartNode.calls.count()).toBe(1);
        expect(scope.selectEndNode.calls.count()).toBe(0);
        expect(scope.reset.calls.count()).toBe(0);


        scope.start = {};
        scope.handleTouchPosition(position);

        expect(scope.selectStartNode.calls.count()).toBe(1);
        expect(scope.selectEndNode.calls.count()).toBe(1);
        expect(scope.reset.calls.count()).toBe(0);


        scope.end = {};
        scope.handleTouchPosition(position);

        expect(scope.selectStartNode.calls.count()).toBe(1);
        expect(scope.selectEndNode.calls.count()).toBe(1);
        expect(scope.reset.calls.count()).toBe(1);
    });

    it("should generate a Node", function () {
        var numberOfColumns = 2,
            numberOfRows = 2,
            column = 1,
            row = 0,
            offset = 10,
            curId = 0;

        scope.gridObj.tileSize = 10;
        scope.box = {
            width: 20,
            height: 20
        };

        //spyOn(MathUtils, 'getRandomNumber').and.callFake(function(min, max){
        //
        //});

        var result = scope.generateNode(numberOfColumns, numberOfRows, column, row, offset, curId);

        expect(result.box.x).toBe(10);
        expect(result.box.y).toBe(0);
        expect(result.box.width).toBe(10);
        expect(result.box.height).toBe(10);
        expect(result.id).toBe("0");
    });

    it("should generate a row of Nodes", function () {
        var numberOfColumns = 2,
            numberOfRows = 2,
            row = 0,
            offset = 10,
            curId = 0;

        scope.gridObj.tileSize = 10;
        scope.box = {
            width: 20,
            height: 20
        };

        spyOn(scope, 'generateNode').and.callFake(function (numCols, numRows, curCol, curRow, off, currentId) {
            expect(numCols).toBe(numberOfColumns);
            expect(numRows).toBe(numberOfRows);
            expect(curRow).toBe(row);
            expect(off).toBe(offset);

            return new Node();
        });

        var result = scope.generateGridRow(numberOfColumns, numberOfRows, row, offset, curId);

        expect(result.length).toBe(2);
        expect(scope.generateNode.calls.count()).toBe(2);
    });

    it("should generate a grid of Nodes", function () {
        scope.gridObj.tileSize = 10;
        scope.box = {
            width: 20,
            height: 20
        };

        spyOn(scope, 'generateGridRow').and.callFake(function (cols, rows, rowNum, offset, curId) {
            expect(cols).toBe(1);
            expect(rows).toBe(1);
            expect(rowNum).toBe(0);
            expect(offset).toBe(5);
            expect(curId).toBe(0);
            return [new Node()];
        });
        spyOn(GridService, 'fillGridNeighbors').and.callFake(function (grid, noDiagonal) {
            expect(grid).toBe(scope.gridObj.grid);
            expect(noDiagonal).toBeTruthy();
        });

        scope.generateGrid();

        expect(scope.gridObj.grid.length).toBe(1);
        expect(scope.gridObj.grid[0].length).toBe(1);
        expect(scope.generateGridRow.calls.count()).toBe(1);
        expect(GridService.fillGridNeighbors).toHaveBeenCalled();
    });

    it("should handle a touch event", function () {
        var event = {
            offsetX: 1,
            offsetY: 1,
            type: ''
        };

        scope.gridObj.grid = [];

        spyOn(scope, 'handleTouchPosition').and.callFake(function (position) {
            expect(position.x).toBe(0);
            expect(position.y).toBe(0);
        });

        scope.touch(event);

        expect(scope.handleTouchPosition).not.toHaveBeenCalled();


        scope.gridObj.grid = [[]];
        event.type = 'mouseup';

        scope.touch(event);
        expect(scope.handleTouchPosition).toHaveBeenCalled();
    });
});
