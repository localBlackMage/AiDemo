var MinHeapRetObj = {
    index: null,
    other: null,
    options: { index: null, other: null },
    constructor: function(options) {
        this.index = IsNotNullOrUndefined(options.index) ? options.index : this.options.index;
        this.other = IsNotNullOrUndefined(options.other) ? options.other : this.options.other;
        return this;
    }
};

var MinHeapNodes = {
    _collection: null,
    _currentCapacity: null,
    _index: 0,
    _currentIndex: null,
    options: { capacity: 20 },
    constructor: function(options) {
        this._currentCapacity = IsNotNullOrUndefined(options.capacity) ? options.capacity : this.options.capacity;
        this._collection = [];
        for(var i=0; i<this._currentCapacity;i++){
            this._collection.push(null);
        }
        return this;
    },
    Count: function (){
        return this._index - 1;
    },
    Minimum: function (){
        return this._collection[0];
    },
    GetParent: function(i) {
        var ret = New (MinHeapRetObj, {
            index: parseInt(Math.floor((parseFloat(i) - 1.0) / 2.0))
        });
        if(ret.index >= 0)
            ret.other = this._collection[ret.index];
        return ret;
    },
    GetLeftChild: function(i){
        var ret = New (MinHeapRetObj, {
            index: (2 * i) + 1
        });
        if (ret.index < this._currentCapacity)
            ret.other = this._collection[ret.index];
        return ret;
    },
    GetRightChild: function(i){
        var ret = New (MinHeapRetObj, {
            index: (2 * i) + 2
        });
        if (ret.index < this._currentCapacity)
            ret.other = this._collection[ret.index];
        return ret;
    },
    Insert: function(i){
        this._collection[this._index] = i;

        this.HeapifyUp(this._index);
        this._index++;
    },
    HeapifyUp: function(element){
        var parentIndex, parent,
            parentRes = this.GetParent(element);
        parentIndex = parentRes.index;
        parent = parentRes.other;

        if ((this._collection[element] !== null && parent !== null) && (this._collection[element].distance < parent.distance)) {
            this.Swap(parentIndex, element);
        }
        else if ( this._collection[element] !== null && parent === null && parentIndex >= 0) {
            this.Swap(parentIndex, element);
        }
        else
            return;
        // Swapped, current element is at parentIndex now, and _index is the parent of the element
        //		HeapifyUp(parentIndex);
    },
    Swap: function(a, b){
        var tmp = this._collection[a];
        this._collection[a] = this._collection[b];
        this._collection[b] = tmp;
    },
    ExtractMinimum: function(){
        var minimum = this._collection[0];
        this._collection[0] = this._collection[--this._index];
        this._collection[this._index] = null;
        this.HeapifyResetCurIndex();
        return minimum;
    },
    HeapifyResetCurIndex: function(){
        this._currentIndex = 0;
        this.Heapify(this._currentIndex);
    },
    Heapify: function(index){
        var leftRes = this.GetLeftChild(index),
            rightRes = this.GetRightChild(index),
            leftChildIndex = leftRes.index, rightChildIndex = rightRes.index,
            leftChild = leftRes.other, rightChild = rightRes.other;

        if((leftChild !== null && rightChild !== null) && (leftChild.distance === 0 && rightChild.distance === 0))
            return;
        var replacingElement = 0;

        if (leftChild !== null && rightChild !== null) {
            if (leftChild.distance < rightChild.distance)
                replacingElement = leftChildIndex;
            if (leftChild.distance > rightChild.distance)
                replacingElement = rightChildIndex;

            if (leftChild.distance == rightChild.distance)
                replacingElement = leftChildIndex;

            this.Swap(index, replacingElement);

            this.Heapify(replacingElement);
        }
        else if (leftChild === null && rightChild !== null){
            replacingElement = rightChildIndex;
            this.Swap(index, replacingElement);
        }
        else if (leftChild !== null && rightChild === null){
            replacingElement = leftChildIndex;
            this.Swap(index, replacingElement);
        }
    },
    NodeInHeap: function(node){
        for(var idx = 0; idx < this._collection.length; idx++){
            var n = this._collection[idx];
            if (n !== null && n.id === node.id)
                return true;
        }
        return false;
    },
    Empty: function() {
        if (this._collection.length === 0 || this._collection[0] === null)
            return true;
        return false;
    }
};

var ReconRetValue = {
    map: null,
    node: null,
    constructor: function () { return this; }
};

var DFS = function (start, max) {
    var stack = New(Queue, {});
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

        if(--elementToIncDepth <= 0) {
            if (++count > max) {
                return;
            }
            elementToIncDepth = nextElementToDepthInc;
            nextElementToDepthInc = 0;
        }
    }
};

var heuristic_cost_estimate = function(a, b) {
    var heuristic_multiplier = 0.9;
    return parseInt((a.pos.subNew(b.pos)).length() * heuristic_multiplier);
};

// Dictionary<Node, Node> came_from, Node current_node, Node start_node, Queue<Node> path
var ReconstructPath = function(came_from, current_node, start_node, path) {
    var r = New(ReconRetValue, {});
    if (current_node.id === start_node.id) {
        path.enqueue(current_node);
        r.map = path;
        return r;
    }
    if ( came_from[current_node.id] !== null && came_from[current_node.id] !== undefined) {
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

var A_Star = function(startNode, endNode, nodeMap) {
    if (startNode.id === endNode.id)
        return null;
    startNode.distance = 0;

    var closedSet = [],
        openSet = New(MinHeapNodes, {capacity: 100}),
        came_from = {}, // node.id : node
        g_score = {};   // node.id : float

    openSet.Insert(startNode);
    g_score[startNode.id] = 0;
    startNode.distance = heuristic_cost_estimate(startNode, endNode);

    while (!openSet.Empty()) {
        var current = openSet.ExtractMinimum();
        if (current.id === endNode.id) {
            ResetDistances(nodeMap);
            var results = ReconstructPath(came_from, endNode, startNode, New (Queue, {}));
            return results.map;
//            return ReconstructPath(came_from, endNode, startNode, New (Queue, {})).map;
        }
        closedSet.push(current);
        var neighbors = current.getNeighbors();

        for(var idx = 0; idx < neighbors.length; idx++) {
            var neighbor = neighbors[idx];
            var tentative_g_score = g_score[current.id] + 1.0;

            var g_score_neighbor = heuristic_cost_estimate(neighbor, startNode);
            if (closedSet.indexOf(neighbor) > -1 && tentative_g_score >= g_score_neighbor)
                continue;

            if (!openSet.NodeInHeap(neighbor) || tentative_g_score < g_score_neighbor) {
                came_from[neighbor.id] = current;
                g_score[neighbor.id] = tentative_g_score;
                neighbor.distance = g_score[neighbor.id] + heuristic_cost_estimate(neighbor, endNode);
                if (!openSet.NodeInHeap(neighbor) )
                    openSet.Insert(neighbor);
            }
        }
    }
    ResetDistances(nodeMap);
    return null;
};

var ResetDistances = function(nodeMap) {
    for(var row = 0; row < nodeMap.length; row++) {
        for(var col = 0; col < nodeMap[row].length; col++) {
            if (nodeMap[row][col] !== null)
                nodeMap[row][col].distance = Number.MAX_VALUE;
        }
    }
};