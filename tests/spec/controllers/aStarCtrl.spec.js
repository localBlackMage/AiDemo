describe('A Star Controller', function () {
    'use strict';

    var ctrl, timeout, AStar, GridService, MathUtils, Vector, Node, Queue;

    beforeEach(function () {
        module('aidemo.astar', 'aidemo.models.queue');

        inject(function ($controller, $rootScope, $timeout, _AStar_, _GridService_, _MathUtils_, _Vector_, _Node_, _Queue_, $injector) {
            ctrl = $rootScope.$new();
            timeout = $timeout;
            AStar = $injector.get('AStar');
            GridService = $injector.get('GridService');
            MathUtils = $injector.get('MathUtils');
            Vector = _Vector_;
            Node = _Node_;
            Queue = _Queue_;

            ctrl = $controller('AStarController', {
                $timeout: timeout,
                AStar: AStar,
                GridService: GridService,
                MathUtils: MathUtils,
                Vector: Vector,
                Node: Node
            });
        });

        //spyOn(ctrl, '$emit');
    });

    it("should have certain properties on the ctrl", function () {
        expect(ctrl.BACK_COLOR).toBe("#555555");
        expect(ctrl.GRID_COLOR).toBe("#8EAEC9");
        expect(ctrl.gridObj.grid).toBeDefined();
        expect(ctrl.gridObj.grid.length).toBe(0);
        expect(ctrl.gridObj.tileSize).toBe(20);
        expect(ctrl.start).toBe(null);
        expect(ctrl.end).toBe(null);
    });


    it("should find a node in the grid and call pathSelect on it", function () {

        var node = new Node({id: 0});

        spyOn(node, 'pathSelect').and.callFake(function () {
        });

        ctrl.gridObj.grid = null;

        ctrl.findNodeInGridAndPathSelect({});

        expect(node.pathSelect).not.toHaveBeenCalled();


        ctrl.gridObj.grid = [[{}]];

        ctrl.findNodeInGridAndPathSelect(node);

        expect(node.pathSelect).toHaveBeenCalled();
        expect(ctrl.gridObj.grid[0][0]).toBe(node);
    });

    it("should mark nodes in a path", function () {
        var node = new Node(),
            queue = new Queue();

        queue.enqueue(node);

        spyOn(queue, 'isEmpty').and.callThrough();
        spyOn(queue, 'dequeue').and.callThrough();
        spyOn(ctrl, 'findNodeInGridAndPathSelect').and.callFake(function (node) {
        });

        ctrl.markPath(null);

        expect(queue.isEmpty).not.toHaveBeenCalled();
        expect(queue.dequeue).not.toHaveBeenCalled();
        expect(ctrl.findNodeInGridAndPathSelect).not.toHaveBeenCalled();

        ctrl.markPath(queue);

        expect(queue.isEmpty).toHaveBeenCalled();
        expect(queue.dequeue).toHaveBeenCalled();
        expect(ctrl.findNodeInGridAndPathSelect).toHaveBeenCalled();
    });

    it("should create a path if there is a start and end node", function () {
        var aStarPath = [];

        ctrl.start = null;
        ctrl.end = null;

        spyOn(AStar, 'aStarAlgorithm').and.callFake(function (start, end, grid, dist) {
            expect(start).toBe(ctrl.start);
            expect(end).toBe(ctrl.end);
            expect(grid).toBe(ctrl.gridObj.grid);
            expect(dist).toBe(ctrl.gridObj.tileSize);

            return aStarPath;
        });
        spyOn(ctrl, 'markPath').and.callFake(function (path) {
            expect(path).toBe(aStarPath);
        });

        ctrl.createPath();

        expect(AStar.aStarAlgorithm).not.toHaveBeenCalled();
        expect(ctrl.markPath).not.toHaveBeenCalled();


        ctrl.start = new Node();
        ctrl.end = new Node();

        ctrl.createPath();

        expect(AStar.aStarAlgorithm).toHaveBeenCalled();
        expect(ctrl.markPath).toHaveBeenCalled();
    });

    it("should select an eligible start node and highlight eligible end nodes", function () {
        var node1 = new Node(),
            node2 = new Node(),
            position = new Vector();
        ctrl.gridObj.grid = [[null, node1, node2]];

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

        ctrl.selectStartNode(position);

        expect(node1.specialSelect.calls.count()).toBe(1);
        expect(node1.reset.calls.count()).toBe(1);
        expect(node2.specialSelect.calls.count()).toBe(1);
        expect(node2.reset.calls.count()).toBe(1);
        expect(ctrl.start).toBe(node2);
    });

    it("should select an eligible end node and call createPath", function () {
        var node = new Node(),
            position = new Vector();
        ctrl.gridObj.grid = [[null]];

        spyOn(ctrl, 'createPath').and.callFake(function () {
        });
        spyOn(node, 'eligibleForSelect').and.callFake(function (pos) {
            expect(pos).toBe(position);
            return true;
        });

        ctrl.selectEndNode(position);

        expect(ctrl.createPath.calls.count()).toBe(1);


        ctrl.gridObj.grid = [[node]];

        ctrl.selectEndNode(position);

        expect(ctrl.createPath.calls.count()).toBe(2);
        expect(node.eligibleForSelect.calls.count()).toBe(1);
        expect(ctrl.end).toBe(node);
    });

    it("should reset", function () {
        var node = new Node();

        ctrl.start = {};
        ctrl.end = {};
        ctrl.gridObj.grid = [[node]];

        spyOn(node, 'reset').and.callFake(function () {
        });

        ctrl.reset();

        expect(node.reset).toHaveBeenCalled();
        expect(ctrl.start).toBe(null);
        expect(ctrl.end).toBe(null);
    });

    it("should handle a touch position", function () {
        var position = new Vector();

        spyOn(ctrl, 'selectStartNode').and.callFake(function (pos) {
            expect(pos).toBe(position);
        });
        spyOn(ctrl, 'selectEndNode').and.callFake(function (pos) {
            expect(pos).toBe(position);
        });
        spyOn(ctrl, 'reset').and.callFake(function () {
        });


        ctrl.start = null;
        ctrl.handleTouchPosition(position);

        expect(ctrl.selectStartNode.calls.count()).toBe(1);
        expect(ctrl.selectEndNode.calls.count()).toBe(0);
        expect(ctrl.reset.calls.count()).toBe(0);


        ctrl.start = {};
        ctrl.handleTouchPosition(position);

        expect(ctrl.selectStartNode.calls.count()).toBe(1);
        expect(ctrl.selectEndNode.calls.count()).toBe(1);
        expect(ctrl.reset.calls.count()).toBe(0);


        ctrl.end = {};
        ctrl.handleTouchPosition(position);

        expect(ctrl.selectStartNode.calls.count()).toBe(1);
        expect(ctrl.selectEndNode.calls.count()).toBe(1);
        expect(ctrl.reset.calls.count()).toBe(1);
    });

    it("should generate a Node", function () {
        var numberOfColumns = 2,
            numberOfRows = 2,
            column = 1,
            row = 0,
            offset = 10,
            curId = 0;

        ctrl.gridObj.tileSize = 10;
        ctrl.box = {
            width: 20,
            height: 20
        };

        spyOn(MathUtils, 'getRandomNumber').and.callFake(function (min, max) {
            return 0;
        });

        var result = ctrl.generateNode(numberOfColumns, numberOfRows, column, row, offset, curId);

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

        ctrl.gridObj.tileSize = 10;
        ctrl.box = {
            width: 20,
            height: 20
        };

        spyOn(ctrl, 'generateNode').and.callFake(function (numCols, numRows, curCol, curRow, off, currentId) {
            expect(numCols).toBe(numberOfColumns);
            expect(numRows).toBe(numberOfRows);
            expect(curRow).toBe(row);
            expect(off).toBe(offset);

            return new Node();
        });

        var result = ctrl.generateGridRow(numberOfColumns, numberOfRows, row, offset, curId);

        expect(result.length).toBe(2);
        expect(ctrl.generateNode.calls.count()).toBe(2);
    });

    it("should generate a grid of Nodes", function () {
        ctrl.gridObj.tileSize = 10;
        ctrl.box = {
            width: 20,
            height: 20
        };

        spyOn(ctrl, 'generateGridRow').and.callFake(function (cols, rows, rowNum, offset, curId) {
            expect(cols).toBe(1);
            expect(rows).toBe(1);
            expect(rowNum).toBe(0);
            expect(offset).toBe(10);
            expect(curId).toBe(0);
            return [new Node()];
        });
        spyOn(GridService, 'fillGridNeighbors').and.callFake(function (grid, noDiagonal) {
            expect(grid).toBe(ctrl.gridObj.grid);
            expect(noDiagonal).toBeTruthy();
        });

        ctrl.generateGrid();

        expect(ctrl.gridObj.grid.length).toBe(1);
        expect(ctrl.gridObj.grid[0].length).toBe(1);
        expect(ctrl.generateGridRow.calls.count()).toBe(1);
        expect(GridService.fillGridNeighbors).toHaveBeenCalled();
    });

    it("should handle a touch event", function () {
        var event = {
            offsetX: 1,
            offsetY: 1,
            type: ''
        };

        ctrl.gridObj.grid = [];

        spyOn(ctrl, 'handleTouchPosition').and.callFake(function (position) {
            expect(position.x).toBe(0);
            expect(position.y).toBe(0);
        });

        ctrl.touch(event);

        expect(ctrl.handleTouchPosition).not.toHaveBeenCalled();


        ctrl.gridObj.grid = [[]];
        event.type = 'mouseup';

        ctrl.touch(event);
        expect(ctrl.handleTouchPosition).toHaveBeenCalled();
    });
});
