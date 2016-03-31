(function (ng) {
    'use strict';

    ng.module('aidemo.service.aStar', [
        'aidemo.service.utils',
        'aidemo.models.node',
        'aidemo.models.queue'
    ])
        .factory('ReconRetValue', [
            function () {
                function ReconRetValue(params) {
                    params = params || {};
                    this.map = params.map ? params.map : null;
                    this.node = params.node ? params.node : null;
                }

                return ReconRetValue;
            }
        ])
        .factory('MinHeapRetObj', [function () {
            function MinHeapRetObj(params) {
                params = params || {};
                this.index = !_.isUndefined(params.index) ? params.index : null;
                this.other = params.other ? params.other : null;
            }

            return MinHeapRetObj;
        }
        ])
        .factory('MinHeapNodes', ['MinHeapRetObj', 'Node',
            function (MinHeapRetObj, Node) {
                function MinHeapNodes(params) {
                    params = params || {};
                    this._index = 0;
                    this._currentIndex = null;
                    this._currentCapacity = params.capacity ? params.capacity : 20;
                    this._collection = [];
                    for (var i = 0; i < this._currentCapacity; i++) {
                        this._collection.push(null);
                    }
                }

                MinHeapNodes.prototype.count = function () {
                    return this._index - 1;
                };

                MinHeapNodes.prototype.minimum = function () {
                    return this._collection[0];
                };

                MinHeapNodes.prototype.getParent = function (i) {
                    var ret = new MinHeapRetObj({
                        index: parseInt(Math.floor((parseFloat(i) - 1.0) / 2.0), 10)
                    });
                    if (ret.index >= 0) {
                        ret.other = this._collection[ret.index];
                    }
                    return ret;
                };

                MinHeapNodes.prototype.getLeftChild = function (i) {
                    var ret = new MinHeapRetObj({
                        index: (2 * i) + 1
                    });
                    if (ret.index < this._currentCapacity) {
                        ret.other = this._collection[ret.index];
                    }
                    return ret;
                };

                MinHeapNodes.prototype.getRightChild = function (i) {
                    var ret = new MinHeapRetObj({
                        index: (2 * i) + 2
                    });
                    if (ret.index < this._currentCapacity) {
                        ret.other = this._collection[ret.index];
                    }
                    return ret;
                };

                MinHeapNodes.prototype.insert = function (i) {
                    this._collection[this._index] = i;

                    this.heapifyUp(this._index);
                    this._index++;
                };

                MinHeapNodes.prototype.heapifyUp = function (element) {
                    var parentRes = this.getParent(element),
                        parentIndex = parentRes.index,
                        parent = parentRes.other;

                    if (!this._collection[element]) {
                        return;
                    }

                    if (parent && this._collection[element].distance < parent.distance) {
                        this.swap(parentIndex, element);
                    }
                    else if (!parent && parentIndex >= 0) {
                        this.swap(parentIndex, element);
                    }
                    else {
                        return;
                    }
                };

                MinHeapNodes.prototype.swap = function (a, b) {
                    //var tmp = angular.copy(this._collection[a]);
                    var tmp = this._collection[a] ? new Node(this._collection[a]) : null;
                    this._collection[a] = this._collection[b];
                    this._collection[b] = tmp;
                };

                MinHeapNodes.prototype.extractMinimum = function () {
                    var minimum = this.minimum();
                    this._collection[0] = this._collection[--this._index];
                    this._collection[this._index] = null;
                    this.heapifyResetCurIndex();
                    return minimum;
                };

                MinHeapNodes.prototype.heapifyResetCurIndex = function () {
                    this._currentIndex = 0;
                    this.heapify(this._currentIndex);
                };

                MinHeapNodes.prototype.getIndexOfSmallest = function (left, right, lidx, ridx) {
                    if (left > right) {
                        return ridx;
                    }
                    else if (left < right) {
                        return lidx;
                    }
                    return lidx;
                };

                MinHeapNodes.prototype.heapify = function (index) {
                    var leftRes = this.getLeftChild(index),
                        rightRes = this.getRightChild(index),
                        leftChildIndex = leftRes.index,
                        rightChildIndex = rightRes.index,
                        leftChild = leftRes.other,
                        rightChild = rightRes.other;

                    if ((leftChild && rightChild) && (leftChild.distance === 0 && rightChild.distance === 0)) {
                        return;
                    }

                    if (leftChild && rightChild) {
                        var replacingElement = this.getIndexOfSmallest(leftChild.distance, rightChild.distance, leftChildIndex, rightChildIndex);

                        this.swap(index, replacingElement);

                        this.heapify(replacingElement);
                    }
                    else if (!leftChild && rightChild) {
                        this.swap(index, rightChildIndex);
                    }
                    else if (leftChild && !rightChild) {
                        this.swap(index, leftChildIndex);
                    }
                };

                MinHeapNodes.prototype.nodeInHeap = function (node) {
                    for (var idx = 0; idx < this._collection.length; idx++) {
                        var otherNode = this._collection[idx];
                        if (otherNode && otherNode.id === node.id) {
                            return true;
                        }
                    }
                    return false;
                };

                MinHeapNodes.prototype.empty = function () {
                    return !this._collection[0];
                };

                return MinHeapNodes;
            }
        ])
        .service('AStar', ['Queue', 'MinHeapNodes', 'ReconRetValue',
            function (Queue, MinHeapNodes, ReconRetValue) {
                var service = this;

                service.depthFirstSearch = function (start, max) {
                    var stack = new Queue();
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

                service._heuristicCostEstimate = function (a, b) {
                    var heuristic_multiplier = 0.9;
                    return parseInt(parseFloat((a.position.subNew(b.position)).length()) * heuristic_multiplier, 10);
                };

                // Dictionary<Node, Node> came_from, Node current_node, Node start_node, Queue<Node> path
                service._reconstructPath = function (came_from, current_node, start_node, path) {
                    var reconstructedPath = new ReconRetValue();

                    if (current_node.id === start_node.id) {
                        path.enqueue(current_node);
                        reconstructedPath.map = path;
                        return reconstructedPath;
                    }

                    if (!_.isUndefined(came_from[current_node.id]) && !_.isNull(came_from[current_node.id])) {
                        reconstructedPath = service._reconstructPath(came_from, came_from[current_node.id], start_node, path);
                        path.enqueue(current_node);
                        reconstructedPath.map = path;
                    }
                    else {
                        reconstructedPath.node = current_node;
                    }

                    return reconstructedPath;
                };

                service._resetDistances = function (nodeMap) {
                    for (var row = 0; row < nodeMap.length; row++) {
                        for (var col = 0; col < nodeMap[row].length; col++) {
                            if (nodeMap[row][col]) {
                                nodeMap[row][col].distance = Number.MAX_VALUE;
                            }
                        }
                    }
                };

                service._isNodeInArray = function(array, node) {
                    return _.findIndex(array, function (otherNode) {
                        return otherNode.id === node.id;
                    }) > -1;
                };

                service.aStarAlgorithm = function (startNode, endNode, nodeMap, distBetween) {
                    if (startNode.id === endNode.id) {
                        return null;
                    }
                    distBetween = parseFloat(distBetween);

                    startNode.distance = 0;

                    var closedSet = [],
                        openSet = new MinHeapNodes({capacity: 100}),
                        came_from = {}, // node.id : node
                        g_score = {};   // node.id : float

                    openSet.insert(startNode);
                    g_score[startNode.id] = 0;
                    startNode.distance = service._heuristicCostEstimate(startNode, endNode);

                    while (!openSet.empty()) {
                        var current = openSet.extractMinimum();

                        // Made it to goal, return the path
                        if (current.id === endNode.id) {
                            service._resetDistances(nodeMap);
                            return service._reconstructPath(came_from, endNode, startNode, new Queue()).map;
                        }

                        closedSet.push(current);
                        var neighbors = current.getNeighbors();

                        /**
                         * This is typically calculated in the following for loop, but since the distance
                         * between nodes is the same no matter what, it can be calculated here to save time
                         */
                        var tentative_g_score = parseFloat(g_score[current.id]) + distBetween;

                        for (var idx = 0; idx < neighbors.length; idx++) {
                            var neighbor = neighbors[idx];
                            var g_score_neighbor = parseFloat(service._heuristicCostEstimate(neighbor, startNode));
                            var neighborInClosedSet = service._isNodeInArray(closedSet, neighbor);

                            if (neighborInClosedSet && tentative_g_score >= g_score_neighbor) {
                                continue;
                            }

                            if (!openSet.nodeInHeap(neighbor) || tentative_g_score < g_score_neighbor) {
                                came_from[neighbor.id] = current;
                                g_score[neighbor.id] = tentative_g_score;
                                neighbor.distance = g_score[neighbor.id] + parseFloat(service._heuristicCostEstimate(neighbor, endNode));
                                openSet.insert(neighbor);
                            }
                        }
                    }
                    service._resetDistances(nodeMap);
                    return null;
                };
            }
        ]);
})(angular);