describe("MinHeapNodes", function () {
    var MinHeapNodes, MinHeapRetObj, Node, itemOne, itemTwo, itemThree, itemFour, itemFive;

    beforeEach(function () {
        module('aidemo.service.aStar', 'aidemo.models.node');

        inject(function (_MinHeapNodes_, _MinHeapRetObj_, _Node_) {
            MinHeapNodes = _MinHeapNodes_;
            MinHeapRetObj = _MinHeapRetObj_;
            Node = _Node_;
        });


        itemOne = new Node({id: 0, distance: 7});
        itemTwo = new Node({id: 1, distance: 5});
        itemThree = new Node({id: 2, distance: 9});
        itemFour = new Node({id: 3, distance: 3});
        itemFive = new Node({id: 4, distance: 1});
    });

    it("should instantiate properly", function () {
        var minHeap = new MinHeapNodes({});

        expect(minHeap._currentCapacity).toBe(20);
        expect(minHeap._collection).toBeDefined();
        expect(minHeap._collection.length).toBe(20);
        for (var idx = 0; idx < minHeap._collection.length; idx++) {
            expect(minHeap._collection[idx]).toBe(null);
        }
        expect(minHeap._index).toBe(0);
    });

    it("should return it's count", function () {
        var minHeap = new MinHeapNodes({}), res;

        res = minHeap.count();

        expect(res).toBe(-1);
    });

    it("should return it's minimum object", function () {
        var minHeap = new MinHeapNodes({capacity: 3}), res;

        res = minHeap.minimum();

        expect(res).toBe(null);

        minHeap._collection[0] = itemOne;
        minHeap._collection[1] = itemTwo;
        minHeap._collection[2] = itemThree;

        res = minHeap.minimum();

        expect(res).toBe(itemOne);
    });

    it("should return the parent of a given child in the heap", function () {
        var minHeap = new MinHeapNodes({capacity: 3}), res;
        minHeap._collection[0] = itemOne;
        minHeap._collection[1] = itemTwo;
        minHeap._collection[2] = itemThree;

        res = minHeap.getParent(2);

        expect(res.index).toBe(0);
        expect(res.other).toBe(itemOne);


        res = minHeap.getParent(1);

        expect(res.index).toBe(0);
        expect(res.other).toBe(itemOne);


        res = minHeap.getParent(0);

        expect(res.index).toBe(-1);
        expect(res.other).toBe(null);
    });

    it("should return the left child of a given parent in the heap", function () {
        var minHeap = new MinHeapNodes({capacity: 5}), res;
        minHeap._collection[0] = itemOne;
        minHeap._collection[1] = itemTwo;
        minHeap._collection[2] = itemThree;
        minHeap._collection[3] = itemFour;
        minHeap._collection[4] = itemFive;

        res = minHeap.getLeftChild(0);

        expect(res.index).toBe(1);
        expect(res.other).toBe(itemTwo);

        res = minHeap.getLeftChild(1);

        expect(res.index).toBe(3);
        expect(res.other).toBe(itemFour);
    });

    it("should return the right child of a given parent in the heap", function () {
        var minHeap = new MinHeapNodes({capacity: 5}), res;
        minHeap._collection[0] = itemOne;
        minHeap._collection[1] = itemTwo;
        minHeap._collection[2] = itemThree;
        minHeap._collection[3] = itemFour;
        minHeap._collection[4] = itemFive;

        res = minHeap.getRightChild(0);

        expect(res.index).toBe(2);
        expect(res.other).toBe(itemThree);

        res = minHeap.getRightChild(1);

        expect(res.index).toBe(4);
        expect(res.other).toBe(itemFive);
    });

    it("should insert a node into it's collection at it's current index", function () {
        var minHeap = new MinHeapNodes({capacity: 5}), expected;
        spyOn(minHeap, "heapifyUp").and.callFake(function (index) {
            expect(index).toBe(expected);
        });
        expected = 0;
        minHeap.insert(itemOne);

        expect(minHeap._collection[0]).toBe(itemOne);
        expect(minHeap._index).toBe(1);

        expected = 1;
        minHeap.insert(itemFive);

        expect(minHeap._collection[0]).toBe(itemOne);
        expect(minHeap._collection[1]).toBe(itemFive);
        expect(minHeap._index).toBe(2);
    });

    it("should return out if there is nothing at the given index in heapifyUp", function () {
        var minHeap = new MinHeapNodes({capacity: 5});
        spyOn(minHeap, "getParent").and.callThrough();
        spyOn(minHeap, "swap").and.callThrough();

        minHeap.heapifyUp(0);

        expect(minHeap.getParent.calls.count()).toBe(1);
        expect(minHeap.swap.calls.count()).toBe(0);
    });

    it("should swap the parent and the child if the parent is not null and has a greater distance than the child in heapifyUp", function () {
        var minHeap = new MinHeapNodes({capacity: 5});
        spyOn(minHeap, "getParent").and.callThrough();
        spyOn(minHeap, "swap").and.callThrough();
        minHeap._collection[0] = itemOne;
        minHeap._collection[1] = itemTwo;
        minHeap._index = 2;

        minHeap.heapifyUp(1);

        expect(minHeap.getParent.calls.count()).toBe(1);
        expect(minHeap.swap.calls.count()).toBe(1);
        expect(minHeap._collection[0].id).toBe(itemTwo.id);
        expect(minHeap._collection[1].id).toBe(itemOne.id);
    });

    it("should swap the parent and the child if the parent is null and the parentIndex is greater than or equal to 0 in heapifyUp", function () {
        var minHeap = new MinHeapNodes({capacity: 5});
        spyOn(minHeap, "getParent").and.callThrough();
        spyOn(minHeap, "swap").and.callThrough();
        minHeap._collection[1] = itemTwo;
        minHeap._index = 2;

        minHeap.heapifyUp(1);

        expect(minHeap.getParent.calls.count()).toBe(1);
        expect(minHeap.swap.calls.count()).toBe(1);
        expect(minHeap._collection[0]).toBe(itemTwo);
        expect(minHeap._collection[1]).toBe(null);
    });

    it("should swap the parent and the child if the parent is null and the parentIndex is greater than or equal to 0 in heapifyUp", function () {
        var minHeap = new MinHeapNodes({capacity: 5});
        spyOn(minHeap, "getParent").and.callThrough();
        spyOn(minHeap, "swap").and.callThrough();
        minHeap._collection[1] = itemTwo;
        minHeap._index = 2;

        minHeap.heapifyUp(1);

        expect(minHeap.getParent.calls.count()).toBe(1);
        expect(minHeap.swap.calls.count()).toBe(1);
        expect(minHeap._collection[0]).toBe(itemTwo);
        expect(minHeap._collection[1]).toBe(null);
    });

    it("should return out if no other conditions are met in heapifyUp", function () {
        var minHeap = new MinHeapNodes({capacity: 5});
        spyOn(minHeap, "getParent").and.callThrough();
        spyOn(minHeap, "swap").and.callThrough();
        minHeap._collection[0] = itemOne;

        minHeap.heapifyUp(0);

        expect(minHeap.getParent.calls.count()).toBe(1);
        expect(minHeap.swap.calls.count()).toBe(0);
    });

    it("should swap nodes at two given indices", function () {
        var minHeap = new MinHeapNodes({capacity: 2});
        minHeap._collection[0] = itemOne;
        minHeap._collection[1] = itemTwo;

        minHeap.swap(0, 1);

        expect(minHeap._collection[0].id).toBe(itemTwo.id);
        expect(minHeap._collection[1].id).toBe(itemOne.id);
    });

    it("should extract the minimum node and call heapifyResetCurIndex", function () {
        var minHeap = new MinHeapNodes({capacity: 5}), res;
        minHeap._collection[0] = itemOne;
        minHeap._collection[1] = itemTwo;
        minHeap._collection[2] = itemThree;
        minHeap._collection[3] = itemFour;
        minHeap._collection[4] = itemFive;
        minHeap._index = 5;

        spyOn(minHeap, "heapifyResetCurIndex");

        res = minHeap.extractMinimum();

        expect(res).toBe(itemOne);
        expect(minHeap._index).toBe(4);
        expect(minHeap._collection[0]).toBe(itemFive);
        expect(minHeap._collection[4]).toBe(null);
        expect(minHeap.heapifyResetCurIndex.calls.count()).toBe(1);
    });

    it("should reset the currentIndex and call heapify", function () {
        var minHeap = new MinHeapNodes({capacity: 5});
        minHeap._currentIndex = 5;

        spyOn(minHeap, "heapify").and.callFake(function (index) {
            expect(index).toBe(0);
        });

        minHeap.heapifyResetCurIndex();

        expect(minHeap._currentIndex).toBe(0);
    });

    it("should return the corresponding index of the smaller of two values", function () {
        var minHeap = new MinHeapNodes({}), lidx = 1, ridx = 2, res;

        res = minHeap.getIndexOfSmallest(1, 0, lidx, ridx);
        expect(res).toBe(ridx);

        res = minHeap.getIndexOfSmallest(0, 1, lidx, ridx);
        expect(res).toBe(lidx);

        res = minHeap.getIndexOfSmallest(1, 1, lidx, ridx);
        expect(res).toBe(lidx);
    });

    it("should return out if both children are not null and have distance equal to 0", function () {
        var minHeap = new MinHeapNodes({capacity: 3});
        itemOne.distance = 0;
        itemTwo.distance = 0;
        itemThree.distance = 0;
        minHeap.insert(itemOne);
        minHeap.insert(itemTwo);
        minHeap.insert(itemThree);

        spyOn(minHeap, "getLeftChild").and.callThrough();
        spyOn(minHeap, "getRightChild").and.callThrough();
        spyOn(minHeap, "swap");
        spyOn(minHeap, "heapify").and.callThrough();

        minHeap.heapify(0);

        expect(minHeap.getLeftChild.calls.count()).toBe(1);
        expect(minHeap.getRightChild.calls.count()).toBe(1);
        expect(minHeap.swap.calls.count()).toBe(0);
        expect(minHeap.heapify.calls.count()).toBe(1);
    });

    it("should swap the left child and the parent if the left child has the shortest distance and call itself with the child index", function () {
        var minHeap = new MinHeapNodes({capacity: 3});
        itemOne.distance = 1;
        itemTwo.distance = 2;
        itemThree.distance = 3;
        minHeap.insert(itemOne);
        minHeap.insert(itemTwo);
        minHeap.insert(itemThree);

        spyOn(minHeap, "getLeftChild").and.callThrough();
        spyOn(minHeap, "getRightChild").and.callThrough();
        spyOn(minHeap, "swap").and.callThrough();
        spyOn(minHeap, "heapify").and.callThrough();

        minHeap.heapify(0);

        expect(minHeap.getLeftChild.calls.count()).toBe(2);
        expect(minHeap.getRightChild.calls.count()).toBe(2);
        expect(minHeap.swap.calls.count()).toBe(1);
        expect(minHeap.heapify.calls.count()).toBe(2);

        expect(minHeap._collection[0].id).toBe(itemTwo.id);
        expect(minHeap._collection[1].id).toBe(itemOne.id);
        expect(minHeap._collection[2].id).toBe(itemThree.id);
    });

    it("should swap the right child and the parent if the right child has the shortest distance and call itself with the child index", function () {
        var minHeap = new MinHeapNodes({capacity: 3});
        itemOne.distance = 1;
        itemTwo.distance = 3;
        itemThree.distance = 2;
        minHeap.insert(itemOne);
        minHeap.insert(itemTwo);
        minHeap.insert(itemThree);

        spyOn(minHeap, "getLeftChild").and.callThrough();
        spyOn(minHeap, "getRightChild").and.callThrough();
        spyOn(minHeap, "swap").and.callThrough();
        spyOn(minHeap, "heapify").and.callThrough();

        minHeap.heapify(0);

        expect(minHeap.getLeftChild.calls.count()).toBe(2);
        expect(minHeap.getRightChild.calls.count()).toBe(2);
        expect(minHeap.swap.calls.count()).toBe(1);
        expect(minHeap.heapify.calls.count()).toBe(2);

        expect(minHeap._collection[0].id).toBe(itemThree.id);
        expect(minHeap._collection[1].id).toBe(itemTwo.id);
        expect(minHeap._collection[2].id).toBe(itemOne.id);
    });

    it("should swap the left child and the parent if the right child is null", function () {
        var minHeap = new MinHeapNodes({capacity: 3});
        minHeap._collection[0] = itemOne;
        minHeap._collection[1] = itemTwo;

        spyOn(minHeap, "getLeftChild").and.callThrough();
        spyOn(minHeap, "getRightChild").and.callThrough();
        spyOn(minHeap, "swap").and.callThrough();
        spyOn(minHeap, "heapify").and.callThrough();

        minHeap.heapify(0);

        expect(minHeap.getLeftChild.calls.count()).toBe(1);
        expect(minHeap.getRightChild.calls.count()).toBe(1);
        expect(minHeap.swap.calls.count()).toBe(1);
        expect(minHeap.heapify.calls.count()).toBe(1);

        expect(minHeap._collection[0].id).toBe(itemTwo.id);
        expect(minHeap._collection[1].id).toBe(itemOne.id);
    });

    it("should swap the right child and the parent if the left child is null", function () {
        var minHeap = new MinHeapNodes({capacity: 3});
        minHeap._collection[0] = itemOne;
        minHeap._collection[2] = itemTwo;
        minHeap._index = 2;

        spyOn(minHeap, "getLeftChild").and.callThrough();
        spyOn(minHeap, "getRightChild").and.callThrough();
        spyOn(minHeap, "swap").and.callThrough();
        spyOn(minHeap, "heapify").and.callThrough();

        minHeap.heapify(0);

        expect(minHeap.getLeftChild.calls.count()).toBe(1);
        expect(minHeap.getRightChild.calls.count()).toBe(1);
        expect(minHeap.swap.calls.count()).toBe(1);
        expect(minHeap.heapify.calls.count()).toBe(1);

        expect(minHeap._collection[0].id).toBe(itemTwo.id);
        expect(minHeap._collection[2].id).toBe(itemOne.id);
    });

    it("should know if a node is in the heap", function () {
        var minHeap = new MinHeapNodes({capacity: 5}), res;
        minHeap._collection[0] = itemOne;
        minHeap._collection[1] = itemTwo;
        minHeap._collection[2] = itemThree;
        minHeap._collection[3] = itemFour;

        res = minHeap.nodeInHeap(itemThree);

        expect(res).toBe(true);

        res = minHeap.nodeInHeap(itemFive);

        expect(res).toBe(false);
    });

    it("should know if the heap is empty", function () {
        var minHeap = new MinHeapNodes({capacity: 5}), res;

        res = minHeap.empty();

        expect(res).toBe(true);

        minHeap._collection[0] = itemOne;

        res = minHeap.empty();

        expect(res).toBe(false);
    });
});