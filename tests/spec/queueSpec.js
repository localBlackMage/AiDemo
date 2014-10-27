describe("Queue Tests", function () {
    beforeEach(module("DemoApp"));

    it("should instantiate properly", function () {
        var queue = New (Queue, {});

        expect(queue.queue).toBeDefined();
        expect(queue.queue.length).toBe(0);
        expect(queue.head).toBeDefined();
        expect(queue.head).toBe(0);
    });

    it("should return the length of the queue", function () {
        var queue = New (Queue, {}), res;
        queue.queue = [{}, {}];
        queue.head = 1;

        res = queue.count();

        expect(res).toBe(1);
    });

    it("should know if the queue is empty", function () {
        var queue = New (Queue, {}), res;

        res = queue.isEmpty();

        expect(res).toBe(true);

        queue.queue = [{}];

        res = queue.isEmpty();

        expect(res).toBe(false);
    });

    it("should push an item into the queue when enqueue is called", function () {
        var queue = New (Queue, {}), res;

        queue.enqueue({id: 0});

        expect(queue.queue.length).toBe(1);
        expect(queue.queue).toContain({id:0});
    });

    it("should remove an item from the queue when dequeue is called", function () {
        var queue = New (Queue, {}), res;
        queue.queue = [{id: 0},{id:1}];
        queue.head = 1;


    });

    it("should peek at the last element in the queue", function () {
        var queue = New (Queue, {}), res;
        queue.queue = [{id: 0},{id:1}];
        queue.head = 1;

        res = queue.peek();

        expect(res).toBe(queue.queue[1]);

        queue.queue = [];

        res = queue.peek();

        expect(res).toBe(undefined);
    });
});