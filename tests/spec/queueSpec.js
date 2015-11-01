describe("Queue Model", function () {
    var Queue;

    beforeEach(function () {
        module('aidemo.models.queue');

        inject(function (_Queue_) {
            Queue = _Queue_;
        });
    });

    it("should instantiate properly", function () {
        var queue = new Queue();

        expect(queue.queue).toBeDefined();
        expect(queue.queue.length).toBe(0);
        expect(queue.offset).toBeDefined();
        expect(queue.offset).toBe(0);
    });

    it("should return the length of the queue", function () {
        var queue = new Queue(), res;
        queue.queue = [{}, {}];
        queue.offset = 1;

        res = queue.count();

        expect(res).toBe(1);
    });

    it("should know if the queue is empty", function () {
        var queue = new Queue(), res;

        res = queue.isEmpty();

        expect(res).toBeTruthy();

        queue.queue = [{}];

        res = queue.isEmpty();

        expect(res).toBeFalsy();
    });

    it("should push an item into the queue when enqueue is called", function () {
        var queue = new Queue();

        queue.queue = [{id: 0}];

        queue.enqueue({id: 1});

        expect(queue.queue.length).toBe(2);
        expect(queue.queue[0].id).toBe(0);
        expect(queue.queue[1].id).toBe(1);
    });

    it("should remove an item from the queue when dequeue is called", function () {
        var queue = new Queue();

        queue.queue = [];

        expect(queue.dequeue()).not.toBeDefined();

        queue.queue = [{id: 0}, {id: 1}, {id: 2}, {id: 3}, {id: 4}];

        var res = queue.dequeue();

        expect(queue.queue.length).toBe(5);
        expect(queue.queue[0].id).toBe(0);
        expect(queue.queue[1].id).toBe(1);
        expect(queue.queue[2].id).toBe(2);
        expect(queue.queue[3].id).toBe(3);
        expect(queue.queue[4].id).toBe(4);
        expect(queue.offset).toBe(1);
        expect(res.id).toBe(0);


        queue.queue = [{id: 0}, {id: 1}, {id: 2}, {id: 3}, {id: 4}];
        queue.offset = 0;

        var res1 = queue.dequeue(),
            res2 = queue.dequeue(),
            res3 = queue.dequeue(),
            res4 = queue.dequeue();

        expect(queue.queue.length).toBe(1);
        expect(queue.queue[0].id).toBe(4);
        expect(queue.offset).toBe(0);
        expect(res1.id).toBe(0);
        expect(res2.id).toBe(1);
        expect(res3.id).toBe(2);
        expect(res4.id).toBe(3);
    });

    it("should peek at the last element in the queue", function () {
        var queue = new Queue(), res;

        queue.queue = [{id: 0}, {id: 1}, {id: 2}, {id: 3}];
        queue.offset = 1;

        res = queue.peek();

        expect(res.id).toBe(1);

        queue.queue = [];

        res = queue.peek();

        expect(res).toBe(undefined);
    });
});