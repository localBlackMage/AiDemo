describe("MinHeapNodes Tests", function () {
    var itemOne =   New(Node, {id: 0, distance: 7}),
        itemTwo =   New(Node, {id: 1, distance: 5}),
        itemThree = New(Node, {id: 2, distance: 9}),
        itemFour =  New(Node, {id: 3, distance: 3}),
        itemFive =  New(Node, {id: 4, distance: 1});

    beforeEach(module("DemoApp"));

    it("should instantiate properly", function () {
        var minHeap = New (MinHeapNodes, {});

        expect(minHeap._currentCapacity).toBe(20);
        expect(minHeap._collection).toBeDefined();
        expect(minHeap._collection.length).toBe(20);
        for(var idx=0;idx<minHeap._collection.length;idx++) {
            expect(minHeap._collection[idx]).toBe(null);
        }
        expect(minHeap._index).toBe(0);
    });

    it("should return it's count", function () {
        var minHeap = New (MinHeapNodes, {}), res;

        res = minHeap.Count();

        expect(res).toBe(-1);
    });

    it("should return it's minimum object", function () {
        var minHeap = New (MinHeapNodes, {capacity:3}), res;

        res = minHeap.Minimum();

        expect(res).toBe(null);

        minHeap._collection[0] = itemOne;
        minHeap._collection[1] = itemTwo;
        minHeap._collection[2] = itemThree;

        res = minHeap.Minimum();

        expect(res).toBe(itemOne);
    });

    it("should return the parent of a given child in the heap", function () {
        var minHeap = New (MinHeapNodes, {capacity:3}), res;
        minHeap._collection[0] = itemOne;
        minHeap._collection[1] = itemTwo;
        minHeap._collection[2] = itemThree;

        res = minHeap.GetParent(2);

        expect(res.index).toBe(0);
        expect(res.other).toBe(itemOne);

        res = minHeap.GetParent(1);

        expect(res.index).toBe(0);
        expect(res.other).toBe(itemOne);

        res = minHeap.GetParent(0);

        expect(res.index).toBe(-1);
        expect(res.other).toBe(null);
    });

    it("should return the left child of a given parent in the heap", function () {
        var minHeap = New (MinHeapNodes, {capacity:5}), res;
        minHeap._collection[0] = itemOne;
        minHeap._collection[1] = itemTwo;
        minHeap._collection[2] = itemThree;
        minHeap._collection[3] = itemFour;
        minHeap._collection[4] = itemFive;

        res = minHeap.GetLeftChild(0);

        expect(res.index).toBe(1);
        expect(res.other).toBe(itemTwo);

        res = minHeap.GetLeftChild(1);

        expect(res.index).toBe(3);
        expect(res.other).toBe(itemFour);
    });

    it("should return the right child of a given parent in the heap", function () {
        var minHeap = New (MinHeapNodes, {capacity:5}), res;
        minHeap._collection[0] = itemOne;
        minHeap._collection[1] = itemTwo;
        minHeap._collection[2] = itemThree;
        minHeap._collection[3] = itemFour;
        minHeap._collection[4] = itemFive;

        res = minHeap.GetRightChild(0);

        expect(res.index).toBe(2);
        expect(res.other).toBe(itemThree);

        res = minHeap.GetRightChild(1);

        expect(res.index).toBe(4);
        expect(res.other).toBe(itemFive);
    });

    it("should insert a node into it's collection at it's current index", function () {
        var minHeap = New (MinHeapNodes, {capacity:5}), expected;
        spyOn(minHeap, "HeapifyUp").and.callFake(function(index) {
            expect(index).toBe(expected);
        });
        expected = 0;
        minHeap.Insert(itemOne);

        expect(minHeap._collection[0]).toBe(itemOne);
        expect(minHeap._index).toBe(1);

        expected = 1;
        minHeap.Insert(itemFive);

        expect(minHeap._collection[0]).toBe(itemOne);
        expect(minHeap._collection[1]).toBe(itemFive);
        expect(minHeap._index).toBe(2);
    });

    it("should return out if there is nothing at the given index in HeapifyUp", function () {
        var minHeap = New (MinHeapNodes, {capacity:5});
        spyOn(minHeap, "GetParent").and.callThrough();
        spyOn(minHeap, "Swap").and.callThrough();

        minHeap.HeapifyUp(0);

        expect(minHeap.GetParent.calls.count()).toBe(1);
        expect(minHeap.Swap.calls.count()).toBe(0);
    });

    it("should swap the parent and the child if the parent is not null and has a greater distance than the child in HeapifyUp", function () {
        var minHeap = New (MinHeapNodes, {capacity:5});
        spyOn(minHeap, "GetParent").and.callThrough();
        spyOn(minHeap, "Swap").and.callThrough();
        minHeap._collection[0] = itemOne;
        minHeap._collection[1] = itemTwo;
        minHeap._index = 2;

        minHeap.HeapifyUp(1);

        expect(minHeap.GetParent.calls.count()).toBe(1);
        expect(minHeap.Swap.calls.count()).toBe(1);
        expect(minHeap._collection[0]).toBe(itemTwo);
        expect(minHeap._collection[1]).toBe(itemOne);
    });

    it("should swap the parent and the child if the parent is null and the parentIndex is greater than or equal to 0 in HeapifyUp", function () {
        var minHeap = New (MinHeapNodes, {capacity:5});
        spyOn(minHeap, "GetParent").and.callThrough();
        spyOn(minHeap, "Swap").and.callThrough();
        minHeap._collection[1] = itemTwo;
        minHeap._index = 2;

        minHeap.HeapifyUp(1);

        expect(minHeap.GetParent.calls.count()).toBe(1);
        expect(minHeap.Swap.calls.count()).toBe(1);
        expect(minHeap._collection[0]).toBe(itemTwo);
        expect(minHeap._collection[1]).toBe(null);
    });

    it("should swap the parent and the child if the parent is null and the parentIndex is greater than or equal to 0 in HeapifyUp", function () {
        var minHeap = New (MinHeapNodes, {capacity:5});
        spyOn(minHeap, "GetParent").and.callThrough();
        spyOn(minHeap, "Swap").and.callThrough();
        minHeap._collection[1] = itemTwo;
        minHeap._index = 2;

        minHeap.HeapifyUp(1);

        expect(minHeap.GetParent.calls.count()).toBe(1);
        expect(minHeap.Swap.calls.count()).toBe(1);
        expect(minHeap._collection[0]).toBe(itemTwo);
        expect(minHeap._collection[1]).toBe(null);
    });

    it("should return out if no other conditions are met in HeapifyUp", function () {
        var minHeap = New (MinHeapNodes, {capacity:5});
        spyOn(minHeap, "GetParent").and.callThrough();
        spyOn(minHeap, "Swap").and.callThrough();
        minHeap._collection[0] = itemOne;

        minHeap.HeapifyUp(0);

        expect(minHeap.GetParent.calls.count()).toBe(1);
        expect(minHeap.Swap.calls.count()).toBe(0);
    });

    it("should swap nodes at two given indecies", function () {
        var minHeap = New (MinHeapNodes, {capacity:2});
        minHeap._collection[0] = itemOne;
        minHeap._collection[1] = itemTwo;

        minHeap.Swap(0, 1);

        expect(minHeap._collection[0]).toBe(itemTwo);
        expect(minHeap._collection[1]).toBe(itemOne);
    });

    it("should extract the minimum node and call HeapifyResetCurIndex", function () {
        var minHeap = New (MinHeapNodes, {capacity:5}), res;
        minHeap._collection[0] = itemOne;
        minHeap._collection[1] = itemTwo;
        minHeap._collection[2] = itemThree;
        minHeap._collection[3] = itemFour;
        minHeap._collection[4] = itemFive;
        minHeap._index = 5;

        spyOn(minHeap, "HeapifyResetCurIndex");

        res = minHeap.ExtractMinimum();

        expect(res).toBe(itemOne);
        expect(minHeap._index).toBe(4);
        expect(minHeap._collection[0]).toBe(itemFive);
        expect(minHeap._collection[4]).toBe(null);
        expect(minHeap.HeapifyResetCurIndex.calls.count()).toBe(1);
    });

    it("should reset the currentIndex and call Heapify", function () {
        var minHeap = New (MinHeapNodes, {capacity:5});
        minHeap._currentIndex = 5;

        spyOn(minHeap, "Heapify").and.callFake(function(index) {
            expect(index).toBe(0);
        });

        minHeap.HeapifyResetCurIndex();

        expect(minHeap._currentIndex).toBe(0);
    });

    it("should ", function () {
        var minHeap = New (MinHeapNodes, {capacity:5});
        minHeap._currentIndex = 5;

        spyOn(minHeap, "Heapify").and.callFake(function(index) {
            expect(index).toBe(0);
        });

        minHeap.HeapifyResetCurIndex();

        expect(minHeap._currentIndex).toBe(0);
    });

    it("should know if a node is in the heap", function () {
        var minHeap = New (MinHeapNodes, {capacity:5}), res;
        minHeap._collection[0] = itemOne;
        minHeap._collection[1] = itemTwo;
        minHeap._collection[2] = itemThree;
        minHeap._collection[3] = itemFour;

        res = minHeap.NodeInHeap(itemThree);

        expect(res).toBe(true);

        res = minHeap.NodeInHeap(itemFive);

        expect(res).toBe(false);
    });

    it("should know if the heap is empty", function () {
        var minHeap = New (MinHeapNodes, {capacity:5}), res;

        res = minHeap.Empty();

        expect(res).toBe(true);

        minHeap._collection[0] = itemOne;

        res = minHeap.Empty();

        expect(res).toBe(false);
    });
});