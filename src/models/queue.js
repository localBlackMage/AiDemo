(function (ng) {
    'use strict';

    ng.module('aidemo.models.queue', [])
        .factory('Queue', [
            function () {
                /* code.stephenmorley.org */
                function Queue() {
                    this.queue = [];
                    this.offset = 0;
                }

                Queue.prototype.count = function () {
                    return (this.queue.length - this.offset);
                };

                Queue.prototype.isEmpty = function () {
                    return (this.queue.length === 0);
                };

                Queue.prototype.enqueue = function (item) {
                    this.queue.push(item);
                };

                Queue.prototype.dequeue = function () {
                    if (this.queue.length === 0) return undefined;
                    var item = this.queue[this.offset];
                    if (++this.offset * 2 >= this.queue.length) {
                        this.queue = this.queue.slice(this.offset);
                        this.offset = 0;
                    }
                    return item;
                };

                Queue.prototype.peek = function () {
                    return (this.queue.length > 0 ? this.queue[this.offset] : undefined);
                };

                return Queue;
            }
        ]);
})(angular);