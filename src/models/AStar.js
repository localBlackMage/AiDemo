(function (ng) {
    'use strict';

    ng.module('aidemo.services.aStar', [
        'aidemo.service.utils'
    ])
        .factory('ReconRetValue', [
            function () {
                /**
                 * Constructor, with class name
                 */
                function ReconRetValue(params) {
                    this.map = params.map ? params.map : null;
                    this.node = params.node ? params.node : null;
                }

                ReconRetValue.build = function (data) {
                    return new MinHeapRetObj(data);
                };

                return ReconRetValue;
            }
        ])
        .factory('MinHeapRetObj', ['Utils',
            function (Utils) {
                /**
                 * Constructor, with class name
                 */
                function MinHeapRetObj(params) {
                    this.index = Utils.isNotNullOrUndefined(params.index) ? params.index : null;
                    this.other = Utils.isNotNullOrUndefined(params.other) ? params.other : null;
                }

                MinHeapRetObj.build = function (data) {
                    return new MinHeapRetObj(data);
                };

                return MinHeapRetObj;
            }
        ])
        .factory('MinHeapNodes', ['Utils',
            function (Utils) {
                /**
                 * Constructor, with class name
                 */
                function MinHeapNodes(params) {
                    this._index = 0;
                    this._currentIndex = null;
                    this._currentCapacity = Utils.isNotNullOrUndefined(params.capacity) ? params.capacity : 20;
                    this._collection = [];
                    for (var i = 0; i < this._currentCapacity; i++) {
                        this._collection.push(null);
                    }
                }

                MinHeapNodes.build = function (data) {
                    return new MinHeapRetObj(data);
                };

                MinHeapNodes.prototype.Count = function () {
                    return this._index - 1;
                };

                MinHeapNodes.prototype.Minimum = function () {
                    return this._collection[0];
                };

                MinHeapNodes.prototype.GetParent = function (i) {
                    var ret = new MinHeapRetObj({
                        index: parseInt(Math.floor((parseFloat(i) - 1.0) / 2.0))
                    });
                    if (ret.index >= 0)
                        ret.other = this._collection[ret.index];
                    return ret;
                };

                MinHeapNodes.prototype.GetLeftChild = function (i) {
                    var ret = new MinHeapRetObj({
                        index: (2 * i) + 1
                    });
                    if (ret.index < this._currentCapacity)
                        ret.other = this._collection[ret.index];
                    return ret;
                };

                MinHeapNodes.prototype.GetRightChild = function (i) {
                    var ret = new MinHeapRetObj({
                        index: (2 * i) + 2
                    });
                    if (ret.index < this._currentCapacity)
                        ret.other = this._collection[ret.index];
                    return ret;
                };

                MinHeapNodes.prototype.Insert = function (i) {
                    this._collection[this._index] = i;

                    this.HeapifyUp(this._index);
                    this._index++;
                };

                MinHeapNodes.prototype.HeapifyUp = function (element) {
                    var parentRes = this.GetParent(element),
                        parentIndex = parentRes.index,
                        parent = parentRes.other;

                    if (this._collection[element] === null)
                        return;

                    if (parent !== null && this._collection[element].distance < parent.distance) {
                        this.Swap(parentIndex, element);
                    }
                    else if (parent === null && parentIndex >= 0) {
                        this.Swap(parentIndex, element);
                    }
                    else
                        return;
                };

                MinHeapNodes.prototype.Swap = function (a, b) {
                    var tmp = Clone(this._collection[a], Node);
                    this._collection[a] = this._collection[b];
                    this._collection[b] = tmp;
                };

                MinHeapNodes.prototype.ExtractMinimum = function () {
                    var minimum = this.Minimum();
                    this._collection[0] = this._collection[--this._index];
                    this._collection[this._index] = null;
                    this.HeapifyResetCurIndex();
                    return minimum;
                };

                MinHeapNodes.prototype.HeapifyResetCurIndex = function () {
                    this._currentIndex = 0;
                    this.Heapify(this._currentIndex);
                };

                MinHeapNodes.prototype.GetIndexOfSmallest = function (left, right, lidx, ridx) {
                    if (left < right)
                        return lidx;
                    else if (left > right)
                        return ridx;
                    return lidx;
                };

                MinHeapNodes.prototype.Heapify = function (index) {
                    var leftRes = this.GetLeftChild(index),
                        rightRes = this.GetRightChild(index),
                        leftChildIndex = leftRes.index, rightChildIndex = rightRes.index,
                        leftChild = leftRes.other, rightChild = rightRes.other;

                    if ((leftChild !== null && rightChild !== null) && (leftChild.distance === 0 && rightChild.distance === 0))
                        return;
                    var replacingElement;

                    if (leftChild !== null && rightChild !== null) {
                        replacingElement = this.GetIndexOfSmallest(leftChild.distance, rightChild.distance, leftChildIndex, rightChildIndex);

                        this.Swap(index, replacingElement);

                        this.Heapify(replacingElement);
                    }
                    else if (leftChild === null && rightChild !== null) {
                        replacingElement = rightChildIndex;
                        this.Swap(index, replacingElement);
                    }
                    else if (leftChild !== null && rightChild === null) {
                        replacingElement = leftChildIndex;
                        this.Swap(index, replacingElement);
                    }
                };

                MinHeapNodes.prototype.NodeInHeap = function (node) {
                    for (var idx = 0; idx < this._collection.length; idx++) {
                        var n = this._collection[idx];
                        if (n !== null && n.id === node.id)
                            return true;
                    }
                    return false;
                };

                MinHeapNodes.prototype.Empty = function () {
                    return this._collection.length === 0 || this._collection[0] === null;
                };

                return MinHeapNodes;
            }
        ])
        .factory('AStar', [
            function () {
                var DFS = function (start, max) {
                    var stack = new Queue({});
                    stack.enqueue(start);
                    var count = 0, elementToIncDepth = 0, nextElementToDepthInc = 0, amtToAdd;
                    while (stack.count() !== 0) {
                        var current = stack.dequeue();
                        current.selected = true;
                        var neighbors = current.getNeighbors();
                        amtToAdd = 0;

                        neighbors.forEach(function (node) {
                            stack.enqueue(node);
                            amtToAdd++;
                        });
                        nextElementToDepthInc += amtToAdd;

                        if (--elementToIncDepth <= 0) {
                            if (++count > max) {
                                return;
                            }
                            elementToIncDepth = nextElementToDepthInc;
                            nextElementToDepthInc = 0;
                        }
                    }
                };

                var heuristicCostEstimate = function (a, b) {
                    var heuristic_multiplier = 0.9;
                    return parseInt(parseFloat((a.pos.subNew(b.pos)).length()) * heuristic_multiplier, 10);
                };

                // Dictionary<Node, Node> came_from, Node current_node, Node start_node, Queue<Node> path
                var ReconstructPath = function (came_from, current_node, start_node, path) {
                    var r = ReconRetValue.build();
                    if (current_node.id === start_node.id) {
                        path.enqueue(current_node);
                        r.map = path;
                        return r;
                    }
                    if (came_from[current_node.id] !== null && came_from[current_node.id] !== undefined) {
                        r = ReconstructPath(came_from, came_from[current_node.id], start_node, path);
                        path.enqueue(current_node);
                        r.map = path;
                        return r;
                    }
                    else {
                        r.node = current_node;
                        return r;
                    }
                };

                var A_Star = function (startNode, endNode, nodeMap) {
                    if (startNode.id === endNode.id)
                        return null;
                    startNode.distance = 0;

                    var closedSet = [],
                        openSet = new MinHeapNodes({capacity: 100}),
                        came_from = {}, // node.id : node
                        g_score = {};   // node.id : float

                    openSet.Insert(startNode);
                    g_score[startNode.id] = 0;
                    startNode.distance = heuristicCostEstimate(startNode, endNode);

                    while (!openSet.Empty()) {
                        var current = openSet.ExtractMinimum();
                        if (current.id === endNode.id) {
                            ResetDistances(nodeMap);
                            console.log(came_from);
                            console.log(endNode);
                            console.log(startNode);
//            var results = ReconstructPath(came_from, endNode, startNode, New (Queue, {}));
//            return results.map;
                            return ReconstructPath(came_from, endNode, startNode, new Queue({})).map;
                        }
                        closedSet.push(current);
                        var neighbors = current.getNeighbors();

                        for (var idx = 0; idx < neighbors.length; idx++) {
                            var tentative_g_score = parseFloat(g_score[current.id]) + 1.0;
                            var g_score_neighbor = heuristicCostEstimate(neighbors[idx], startNode);

                            if (closedSet.indexOf(neighbors[idx]) > -1 && tentative_g_score >= g_score_neighbor)
                                continue;

                            if (!openSet.NodeInHeap(neighbors[idx]) || tentative_g_score < g_score_neighbor) {
                                came_from[neighbors[idx].id] = current;
                                g_score[neighbors[idx].id] = parseFloat(tentative_g_score);
                                neighbors[idx].distance = parseFloat(g_score[neighbors[idx].id]) + heuristicCostEstimate(neighbors[idx], endNode);
                                if (!openSet.NodeInHeap(neighbors[idx]))
                                    openSet.Insert(neighbors[idx]);
                            }
                        }
                    }
                    ResetDistances(nodeMap);
                    return null;
                };

                var ResetDistances = function (nodeMap) {
                    for (var row = 0; row < nodeMap.length; row++) {
                        for (var col = 0; col < nodeMap[row].length; col++) {
                            if (nodeMap[row][col] !== null)
                                nodeMap[row][col].distance = Number.MAX_VALUE;
                        }
                    }
                };

                return {
                    DFS: DFS,
                    heuristicCostEstimate: heuristicCostEstimate,
                    A_Star: A_Star,
                    ResetDistances: ResetDistances
                };
            }
        ]);
})(angular);