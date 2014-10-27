var New = function (obj, options) {
    return $.extend(true, {}, obj).constructor(options);
};
var IsNotNullOrUndefined = function (obj) {
    return obj === undefined || obj === null ? false : true;
};
var IsGreaterThanOrNaN = function (obj, min) {
    if (parseInt(obj) > min || isNaN(parseInt(obj)))
        return true;
    else
        return false;
};

var Vector = {
    x: 0, y: 0,
    options: { x: 0, y: 0 },
    constructor: function (options) {
        this.x = options.x ? options.x : this.options.x;
        this.y = options.y ? options.y : this.options.y;
        return this;
    },
    length: function () {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    },
    normalize: function (scalar) {
        if(scalar === null ) scalar = 1;
        var length = this.length();
        return New(Vector, {x: (this.x / length) * scalar, y: (this.y / length) * scalar});
    },
    addNew: function (other) {
        return New(Vector, {x: this.x + other.x, y: this.y + other.y});
    },
    add: function (other) {
        this.x += other.x;
        this.y += other.y;
    },
    subNew: function (other) {
        return New(Vector, {x: this.x - other.x, y: this.y - other.y});
    },
    sub: function (other) {
        this.x -= other.x;
        this.y -= other.y;
    },
    mulNew: function (scalar) {
        return New(Vector, {x: this.x * scalar, y: this.y * scalar});
    },
    mul: function (scalar) {
        this.x *= scalar;
        this.y *= scalar;
    },
    divNew: function (scalar) {
        return New(Vector, {x: this.x / scalar, y: this.y / scalar});
    },
    div: function (div) {
        this.x /= div;
        this.y /= div;
    },
    toString: function () {
        return {x: this.x, y: this.y};
    }
};

var DrawUtils = {
    defaultFont: "12px Verdana",
    clearCanvas: function (canvas) {
        canvas.getContext('2d').clearRect(0, 0, canvas.width + 1, canvas.height + 1);
    },
    fillCanvas: function (canvas, color) {
        canvas.getContext('2d').fillStyle = color;
        canvas.getContext('2d').fillRect(0, 0, canvas.width + 1, canvas.height + 1);
    },
    drawCircle: function (ctx, x, y, r, c) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        ctx.fillStyle = c;
        ctx.fill();
        ctx.strokeStyle = c;
        ctx.stroke();
        ctx.closePath();
    },
    drawRing: function (ctx, x, y, r, c) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        ctx.strokeStyle = c;
        ctx.stroke();
        ctx.closePath();
    },
    drawSquare: function(ctx, box, color) {
        ctx.fillStyle = color;
        ctx.fillRect(box.x, box.y, box.width, box.height);
    },
    drawLine: function (ctx, sX, sY, eX, eY, c) {
        ctx.beginPath();
        ctx.moveTo(sX, sY);
        ctx.lineTo(eX, eY);
        ctx.strokeStyle = c;
        ctx.stroke();
        ctx.closePath();
    },
    drawGrid: function (ctx, box, spacing, color) {
        for (var y = 0; y < box.height; y += spacing) {
            this.drawLine(ctx, 0, y, box.width, y, color);
        }
        for (var x = 0; x < box.width; x += spacing) {
            this.drawLine(ctx, x, 0, x, box.height, color);
        }
    },
    drawExclamation: function (ctx, x, y, c) {
        this.drawLine(ctx, x, y, x, y - 1, c);
        this.drawLine(ctx, x, y - 3, x, y - 13, c);
    },
    drawText: function (ctx, x, y, c, s) {
        ctx.font = this.defaultFont;
        ctx.fillStyle = c;
        ctx.fillText(s, x, y);
    },
    getRandomColor: function () {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    },
    getRandomGreen: function () {
        var color = this.getRandomColor().split(''), min = 5;
        color[1] = color[2] = color[5] = color[6] = "0";
        color[3] = IsGreaterThanOrNaN(color[3], min) ? color[3] : min.toString();
        color[4] = IsGreaterThanOrNaN(color[4], min) ? color[4] : min.toString();
        return color.join('');
    },
    getRandomRed: function () {
        var color = this.getRandomColor().split(''), min = 5;
        color[3] = color[4] = color[5] = color[6] = "0";
        color[1] = IsGreaterThanOrNaN(color[1], min) ? color[1] : min.toString();
        color[2] = IsGreaterThanOrNaN(color[2], min) ? color[2] : min.toString();
        return color.join('');
    }
};

var MathUtils = {
    getRand: function (min, max) {
        return Math.random() * (max - min) + min;
    },
    distance: function (vecA, vecB) {
        return vecA.subNew(vecB).length();
    },
    getNearest: function (array, origin, tolerance) {
        var retArray = [],
            self = this;
        array.forEach(function (item) {
            if (self.distance(origin.pos, item.pos) <= tolerance && origin.pos != item.pos && origin !== item) {
                retArray.push(item);
            }
        });
        return retArray;
    },
    angleToVector: function (angle) {
        return New(Vector, {x: parseFloat(Math.sin(angle)), y: -parseFloat(Math.cos(angle))});
    },
    vectorToAngle: function (vector) {
        return parseFloat(Math.atan2(vector.x, -vector.y));
    }
};

//code.stephenmorley.org
var Queue = {
    queue: [],
    head: 0,
    constructor: function () {
        return this;
    },
    count: function () {
        return this.queue.length - this.head;
    },
    isEmpty: function () {
        return this.queue.length === 0;
    },
    enqueue: function (item) {
        this.queue.push(item);
    },
    dequeue: function () {
        if (this.queue.length === 0) return undefined;
        var item = this.queue[this.head];
        if (++ this.head * 2 >= this.queue.length){
            this.queue  = this.queue.slice(this.head);
            this.head = 0;
        }
        // return the dequeued item
        return item;
    },
    peek: function () {
        return (this.queue.length > 0 ? this.queue[this.head] : undefined);
    }
};
//code.stephenmorley.org

var getNeighbors = function(x, y, xLen, yLen, grid, udlrOnly) {
    udlrOnly = udlrOnly === true || udlrOnly === false ? udlrOnly : false;
    var neighbors = [];
    neighbors.push(x-1 >= 0     ? grid[y][x-1]   : null); // 0, -1
    neighbors.push(x+1 < xLen   ? grid[y][x+1]   : null); // 0, 1
    neighbors.push(y-1 >= 0     ? grid[y-1][x]   : null); // -1, 0
    neighbors.push(y+1 < yLen   ? grid[y+1][x]   : null); // 1, 0

    if (!udlrOnly) {
        neighbors.push(x-1 >= 0 && y-1 >= 0     ? grid[y-1][x-1] : null); // -1, -1
        neighbors.push(x-1 >= 0 && y+1 < yLen   ? grid[y+1][x-1] : null); // 1, -1
        neighbors.push(x+1 < xLen && y-1 >= 0   ? grid[y-1][x+1] : null); // -1, 1
        neighbors.push(x+1 < xLen && y+1 < yLen ? grid[y+1][x+1] : null); // 1, 1
    }


    return neighbors.filter(IsNotNullOrUndefined);
};

var fillNeighbors = function(grid, udlrOnly) {
    udlrOnly = udlrOnly === true || udlrOnly === false ? udlrOnly : false;
    var yLen = grid.length,
        xLen = grid[0].length;
    for(var y = 0; y < grid.length; y++) {
        for(var x = 0; x < grid[y].length; x++) {
            if (grid[y][x]) {
                grid[y][x].fillNeighbors(getNeighbors(x, y, xLen, yLen, grid, udlrOnly));
            }
        }
    }
    return grid;
};

var deepCopyGrid = function(grid, udlr) {
    udlr = udlr === true || udlr === false ? udlr : false;
    var gridCopy = [];
    for(var y = 0; y < grid.length; y++) {
        var row = [];
        for(var x = 0; x < grid[y].length; x++) {
            row.push(New(Cell, {
                box: grid[y][x].box,
                status: grid[y][x].status
            }));
        }
        gridCopy.push(row);
    }
    return fillNeighbors(gridCopy, udlr);
};
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
    return parseInt(parseFloat((a.pos.subNew(b.pos)).length()) * heuristic_multiplier);
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
            console.log(came_from);
            console.log(endNode);
            console.log(startNode);
            var results = ReconstructPath(came_from, endNode, startNode, New (Queue, {}));
            return results.map;
//            return ReconstructPath(came_from, endNode, startNode, New (Queue, {})).map;
        }
        closedSet.push(current);
        var neighbors = current.getNeighbors();

        for(var idx = 0; idx < neighbors.length; idx++) {
            var neighbor = neighbors[idx];
            var tentative_g_score = parseFloat(g_score[current.id]) + 1.0;

            var g_score_neighbor = heuristic_cost_estimate(neighbor, startNode);
            if (closedSet.indexOf(neighbor) > -1 && tentative_g_score >= g_score_neighbor)
                continue;

            if (!openSet.NodeInHeap(neighbor) || tentative_g_score < g_score_neighbor) {
                came_from[neighbor.id] = current;
                g_score[neighbor.id] = parseFloat(tentative_g_score);
                neighbor.distance = parseFloat(g_score[neighbor.id]) + heuristic_cost_estimate(neighbor, endNode);
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
var PREY = "prey", PREDATOR = "pred", EXC_COLOR = "#FF0";
var Entity = {
    pos: null,
    radius: 0, color: "",
    vel: null,
    nose: New(Vector, {}),
    speed: 0,
    cohW: 0, sepW: 0, aliW: 0, avoW: 0, wanW: 0,
    type: "",
    exc: false,
    options: {
        pos: New(Vector, {}),
        radius: 5, color: "#FFF",
        vel: New(Vector, {}),
        speed: 3,
        cohW: 0.0, sepW: 0.0, aliW: 0.0, avoW: 0.0, wanW: 0.5,
        type: PREY
    },

    constructor: function (options) {
        this.pos = IsNotNullOrUndefined(options.pos) ? options.pos : this.options.pos;
        this.vel = IsNotNullOrUndefined(options.vel) ? options.vel : this.options.vel;

        this.radius = IsNotNullOrUndefined(options.radius) ? options.radius : this.options.radius;
        this.color = IsNotNullOrUndefined(options.color) ? options.color : this.options.color;
        this.speed = IsNotNullOrUndefined(options.speed) ? options.speed : this.options.speed;

        this.cohW = IsNotNullOrUndefined(options.cohW) ? options.cohW : this.options.cohW;
        this.sepW = IsNotNullOrUndefined(options.sepW) ? options.sepW : this.options.sepW;
        this.aliW = IsNotNullOrUndefined(options.aliW) ? options.aliW : this.options.aliW;
        this.avoW = IsNotNullOrUndefined(options.avoW) ? options.avoW : this.options.avoW;
        this.wanW = IsNotNullOrUndefined(options.wanW) ? options.wanW : this.options.wanW;

        this.type = IsNotNullOrUndefined(options.type) ? options.type : this.options.type;
        return this;
    },

    cohesion: function (herd) {
        var target = New(Vector, {});
        herd.forEach(function (other) {
            target.add(other.pos);
        });

        if (target.length() !== 0) {
            return target.divNew(herd.length).subNew(this.pos).normalize(1);
        }
        else {
            return target;
        }
    },

    separation: function (herd) {
        var target = New(Vector, {});
        herd.forEach(function (other) {
            target.add(other.pos);
        });

        if (target.length() !== 0) {
            return target.divNew(herd.length).subNew(this.pos).normalize(1).mulNew(-1);
        }
        else {
            return target;
        }
    },

    alignment: function (herd) {
        var target = New(Vector, {});
        herd.forEach(function (other) {
            target.add(other.vel);
        });

        if (target.length() !== 0) {
            return target.divNew(herd.length).normalize(1);
        }
        else {
            return target;
        }
    },

    wander: function () {
        var angle = MathUtils.vectorToAngle(this.vel) + MathUtils.getRand(-0.5,0.5);
        return MathUtils.angleToVector(angle).normalize(1);
    },

    avoidWalls: function(box) {
        var target = New(Vector, {});
        if (this.pos.x < 50) {
            target.x = 1;
        }
        else if (this.pos.x > box.width - 50) {
            target.x = -1;
        }

        if (this.pos.y < 50) {
            target.y = 1;
        }
        else if (this.pos.y > box.height - 50) {
            target.y = -1;
        }
        return target;
    },

    avoidPredators: function(pred) {
        var target = New(Vector, {});
        pred.forEach(function (other) {
            target.add(other.pos);
        });
        if (target.length() !== 0) {
            return target.divNew(pred.length).subNew(this.pos).normalize(1).mulNew(-1);
        }
        else {
            return target;
        }
    },

    updatePrey: function(options) {
        var coh = New(Vector, {}), sep = New(Vector, {}),
            ali = New(Vector, {}), avo = New(Vector, {}),
            wan = New(Vector, {}), wal = New(Vector, {});
        avo = this.avoidPredators(options.pred).mulNew(this.avoW);
        if (avo.length() > 0){
            this.exc = true;
            this.vel.add(avo);
        }
        else {
            this.exc = false;
            coh = this.cohesion(options.herd).mulNew(this.cohW);
            sep = this.separation(options.herd).mulNew(this.sepW);
            ali = this.alignment(options.herd).mulNew(this.aliW);
            wan = this.wander().mulNew(this.wanW);
            wal = this.avoidWalls(options.box).mulNew(0.5);

            var total = coh.addNew(sep).addNew(ali).addNew(wan).addNew(wal);
            this.vel.add(total);
        }
    },

    updatePredator: function(options) {
        var coh = New(Vector, {}), sep = New(Vector, {}),
            ali = New(Vector, {}), wan = New(Vector, {}),
            wal = New(Vector, {});

        coh = this.cohesion(options.herd).mulNew(this.cohW);
        sep = this.separation(options.pred).mulNew(this.sepW);
        ali = this.alignment(options.pred).mulNew(this.aliW);
        wan = this.wander().mulNew(this.wanW);
        wal = this.avoidWalls(options.box).mulNew(0.5);

        var total = coh.addNew(sep).addNew(ali).addNew(wan).addNew(wal);
        this.vel.add(total);
    },

    updateVelocity: function (options) {
        if (this.type === PREY) {
            this.updatePrey(options);
        }
        else {
            this.updatePredator(options);
        }
        return this.vel.normalize(1).mulNew(this.speed);
    },

    avoidWall: function (box) {
        if (this.pos.x < 0) {
            this.vel.x *= -1;
        }
        else if (this.pos.x > box.width) {
            this.vel.x *= -1;
        }

        if (this.pos.y < 0) {
            this.vel.y *= -1;
        }
        else if (this.pos.y > box.height) {
            this.vel.y *= -1;
        }
    },

    keepInBounds: function (box) {
        if (this.pos.x < 0) {
            this.pos.x = 0;
        }
        else if (this.pos.x > box.width) {
            this.pos.x = box.width;
        }

        if (this.pos.y < 0) {
            this.pos.y = 0;
        }
        else if (this.pos.y > box.height) {
            this.pos.y = box.height;
        }
    },

    update: function (options) {
        this.vel = this.updateVelocity(options);
        this.pos = this.vel.addNew(this.pos);
        this.avoidWall(options.box);
        this.keepInBounds(options.box);
    },

    calcNose: function () {
        this.nose = this.pos.addNew(this.vel);
        this.nose = this.vel.normalize(1);
        this.nose = this.nose.mulNew(10);
        this.nose = this.nose.addNew(this.pos);
    },

    render: function (ctx) {
        this.calcNose();
        if (this.exc) {
            DrawUtils.drawExclamation(ctx, this.pos.x, this.pos.y - 10, EXC_COLOR);
        }
        DrawUtils.drawCircle(ctx, this.pos.x, this.pos.y, this.radius, this.color);
        DrawUtils.drawLine(ctx, this.pos.x, this.pos.y, this.nose.x, this.nose.y, this.color);
    }
};
var DEAD_COLOR = "#222", ALIVE_COLOR = "#0F0";
var DEAD = "DEAD", ALIVE = "ALIVE";
var Cell = {
    box: null,
    status: "",
    color: "",
    neighbors: [],

    options: {
        box: {}, status: DEAD
    },

    constructor: function (options) {
        this.box = IsNotNullOrUndefined(options.box) ? options.box : this.options.box;
        this.status = options.status === DEAD || options.status === ALIVE ? options.status : this.options.status;
        this.color = this.status == DEAD ? DEAD_COLOR : ALIVE_COLOR;
        return this;
    },

    fillNeighbors: function (neighbors) {
        this.neighbors = IsNotNullOrUndefined(neighbors) ? neighbors : [];
    },

    rules: function(alive) {
        if (this.status == DEAD) {
            if (alive == 3){
                return ALIVE;
            }
            else {
                return DEAD;
            }
        }
        else {
            if (alive == 2 || alive == 3) {
                return ALIVE;
            }
            else if (alive < 2 || alive > 3) {
                return DEAD;
            }
        }
    },

    setStatus: function(status) {
        this.status = status == DEAD || status == ALIVE ? status : DEAD;
        this.color = this.status == DEAD ? DEAD_COLOR : ALIVE_COLOR;
    },

    update: function () {
        var alive = 0;
        this.neighbors.forEach(function(n) {
            if (n.status == ALIVE) {
                alive++;
            }
        });
        return this.rules(alive);
    },

    render: function (ctx) {
        DrawUtils.drawSquare(ctx, this.box, this.color);
    }
};

var Neuron = {
    options: {

    },

    constructor: function (options) {

        return this;
    },


    update: function () {

    },

    render: function () {

    }
};
var SELECTED_COLOR = "#FFF",
    SPECIAL_COLOR = "#F00",
    RENDER_COLOR = "#000",
    PATH_COLOR = "#0F0",
    RANGE = 25;
var Node = {
    id: null,
    box: null,
    pos: null,
    neighbors: null,
    distance: null,
    selected: false, special: false, path: false,
    options: {
        id: null,
        pos: New(Vector, {}),
        distance: 0,
        box: {}
    },

    constructor: function (options) {
        this.id = IsNotNullOrUndefined(options.id) ? options.id : this.options.id;
        this.pos = IsNotNullOrUndefined(options.pos) ? options.pos : this.options.pos;
        this.distance = IsNotNullOrUndefined(options.distance) ? options.distance : this.options.distance;
        this.box = IsNotNullOrUndefined(options.box) ? options.box : this.options.box;
        return this;
    },

    getNeighbors: function () {
        return this.neighbors;
    },

    fillNeighbors: function (neighbors) {
        this.neighbors = IsNotNullOrUndefined(neighbors) ? neighbors : [];
    },

    resetSelect: function () {
        this.selected = false;
    },

    select: function(pos) {
        var dist = this.pos.subNew(pos).length();
        this.selected = dist <= RANGE;
    },

    specialSelect: function(pos) {
        var dist = this.pos.subNew(pos).length();
        this.special = dist <= RANGE;
        return this.special;
    },

    pathSelect: function() {
        this.path = !this.special;
    },

    update: function (options) {

    },

    renderPaths: function (ctx) {
        var self = this;
        this.neighbors.forEach(function(neighbor) {
            if (neighbor.pos)
                DrawUtils.drawLine(ctx, self.pos.x, self.pos.y, neighbor.pos.x, neighbor.pos.y, ((neighbor.path || neighbor.special) && (this.path || this.special)) ? PATH_COLOR : RENDER_COLOR);
        });
    },

    render: function (ctx) {
        DrawUtils.drawText(ctx, this.pos.x+10, this.pos.y-10, SELECTED_COLOR, this.id.toString());
        if (this.special)
            DrawUtils.drawCircle(ctx, this.pos.x, this.pos.y, 5, SPECIAL_COLOR);
        else if (this.path)
            DrawUtils.drawCircle(ctx, this.pos.x, this.pos.y, 5, PATH_COLOR);
        else
            DrawUtils.drawCircle(ctx, this.pos.x, this.pos.y, 5, this.selected ? SELECTED_COLOR : RENDER_COLOR);
    }
};
var demoApp = angular.module('DemoApp', []);
demoApp.controller('AstarCtrl', ['$scope', function ($scope) {
    // Common Objects/Definitions
    var CAN_BACK = "#222", GRID_COLOR = "#555", GRID_SIZE = 50;

    // Scope Fields
    $scope.canvas = $('#astarCanvas')[0];
    $scope.box = {
        width: $scope.canvas.width,
        height: $scope.canvas.height,
        center: New(Vector, {x: $scope.canvas.width / 2, y: $scope.canvas.height / 2})
    };
    $scope.ctx = $scope.canvas.getContext('2d');
    $scope.step = 0.25;
    $scope.pause = false;
    $scope.gridObj = {
        grid: [],
        tileSize: GRID_SIZE
    };
    $scope.start = null;
    $scope.end = null;

    // Scope Functions
    $scope.markPath = function(path) {
        while(!path.isEmpty()) {
            var node = path.dequeue();
            node.pathSelect();
        }
    };

    $scope.detect = function(pos) {
        if ($scope.start === null) {
            $scope.gridObj.grid.forEach(function (row) {
                row.forEach(function (node) {
                    if (node) {
                        node.resetSelect();
                        if (node.specialSelect(pos)) {
                            $scope.start = node;
                        }
                    }
                });
            });

            if ($scope.start) {
                DFS($scope.start, 5);
            }
        }
        else if ($scope.end === null){
            $scope.gridObj.grid.forEach(function (row) {
                row.forEach(function (node) {
                    if (node && node.selected && !node.special) {
                        if (node.specialSelect(pos)) {
                            $scope.end = node;
                        }
                    }
                });
            });
            $scope.markPath(A_Star($scope.start, $scope.end, $scope.gridObj.grid));
        }
        else {
            $scope.start = null;
            $scope.end = null;
        }
    };

    $scope.generateGrid = function() {
        var curId = 0,
            tCalc = $scope.gridObj.tileSize / 2;
        $scope.gridObj = {
            grid: [],
            tileSize: GRID_SIZE
        };
        for(var y = 0; y < $scope.box.height / $scope.gridObj.tileSize; y++) {
            var arr = [];
            for(var x = 0; x < $scope.box.width / $scope.gridObj.tileSize; x++) {
                var spawn = true;//MathUtils.getRand(0, 1) < 0.8 ? true : false;
                if (spawn) {
                    var pos = New(Vector, {
                        x: x * $scope.gridObj.tileSize + tCalc,
                        y: y * $scope.gridObj.tileSize + tCalc
                    });
                    arr.push((New(Node, {
                        box: {
                            x: x * $scope.gridObj.tileSize,
                            y: y * $scope.gridObj.tileSize,
                            width: $scope.gridObj.tileSize,
                            height: $scope.gridObj.tileSize
                        },
                        id: curId.toString(),
                        pos: pos
                    })));
                }
                else {
                    arr.push(null);
                }
                curId++;
            }
            $scope.gridObj.grid.push(arr);
        }
        fillNeighbors($scope.gridObj.grid, true);
    };

    $scope.update = function () {

    };

    $scope.render = function () {
        DrawUtils.fillCanvas($scope.canvas, CAN_BACK);
        DrawUtils.drawGrid($scope.ctx, $scope.box, GRID_SIZE, GRID_COLOR);

        $scope.gridObj.grid.forEach(function(row) {
            row.forEach(function(node) {
                if (node)
                    node.renderPaths($scope.ctx);
            });
        });

        $scope.gridObj.grid.forEach(function(row) {
            row.forEach(function(node) {
                if (node)
                    node.render($scope.ctx);
            });
        });
    };

    // Setup
    $scope.generateGrid();

    var test = function() {
        for (var row = 0; row < $scope.gridObj.grid.length; row++) {
            for (var col = 0; col < $scope.gridObj.grid[row].length; col++) {
                if ($scope.gridObj.grid[row][col]) {
                    $scope.gridObj.grid[row][col].special = true;
                    DFS($scope.gridObj.grid[row][col], 5);
                    return;
                }
            }
        }
    };
    test();

    // Animation
    window.requestAnimFrame = (function (callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    $scope.animate = function (startTime) {
        var time = (new Date()).getTime() - startTime;
        if (time > $scope.step * 1000 && !$scope.pause) {
            startTime = (new Date()).getTime();
            $scope.update();
            $scope.render();
            $scope.$apply();
        }
        else if ($scope.pause) {
            startTime = (new Date()).getTime();
        }
        // request new frame
        requestAnimFrame(function () {
            $scope.animate(startTime);
        });
    };

    setTimeout(function () {
        var startTime = (new Date()).getTime();
        $scope.animate(startTime);
    }, 0);
}]);

demoApp.directive('ngCanvasAi', function () {
    return {
        restrict: "A",
        link: function (scope, element) {
//            var drawing = false;
            element.bind('mousedown', function (event) {
                scope.detect(New(Vector, {x: event.offsetX - 1, y: event.offsetY - 1}));
//                drawing = true;
            });
//            element.bind('mousemove', function (event) {
//                if (drawing)
//                    scope.detect(New(Vector, {x: event.offsetX - 1, y: event.offsetY - 1}));
//            });
            element.bind('mouseup', function (event) {
//                drawing = false;
            });
        }
    };
});
demoApp.controller('FlockCtrl', ['$scope', function ($scope) {
    var CAN_BACK = "#222", GRID_COLOR = "#555";
    var createHerd = function (num){
        console.log($scope.preyStats);
        var retArray = [];
        for (var idx = 0; idx < num; idx++) {
            var options = {
                pos: New(Vector, {x: MathUtils.getRand(0, $scope.canvas.width), y: MathUtils.getRand(0, $scope.canvas.height)}),
                vel: New(Vector, {x: MathUtils.getRand(-1, 1), y: MathUtils.getRand(-1, 1)}),
                speed: parseFloat($scope.preyStats.speed), cohW: parseFloat($scope.preyStats.cohW), avoW: parseFloat($scope.preyStats.avoW),
                sepW: parseFloat($scope.preyStats.sepW), aliW: parseFloat($scope.preyStats.aliW), wanW: parseFloat($scope.preyStats.wanW),
                type: PREY, color: DrawUtils.getRandomGreen()
            };
            retArray.push(New(Entity, options));
        }
        return retArray;
    };
    var createPredators = function (num) {
        var retArray = [];
        for (var idx = 0; idx < num; idx++) {
            var options = {
                pos: New(Vector, {x: MathUtils.getRand(0, $scope.canvas.width), y: MathUtils.getRand(0, $scope.canvas.height)}),
                vel: New(Vector, {x: MathUtils.getRand(-1, 1), y: MathUtils.getRand(-1, 1)}),
                speed: parseFloat($scope.predStats.speed), cohW: parseFloat($scope.predStats.cohW),
                sepW: parseFloat($scope.predStats.sepW), aliW: parseFloat($scope.predStats.aliW), wanW: parseFloat($scope.predStats.wanW),
                type: PREDATOR, color: DrawUtils.getRandomRed()
            };
            retArray.push(New(Entity, options));
        }
        return retArray;
    };

    $scope.canvas = $('#flockCanvas')[0];
    $scope.box = {
        width: $scope.canvas.width,
        height: $scope.canvas.height,
        center: New(Vector, {x: $scope.canvas.width / 2, y: $scope.canvas.height / 2})
    };
    $scope.ctx = $scope.canvas.getContext('2d');
    $scope.herd = [];
    $scope.predators = [];
    $scope.preyAmt = 5;
    $scope.predAmt = 5;
    $scope.predStats = {
        speed: 3.0,
        cohW: 0.2,
        sepW: 0.2,
        aliW: 0.1,
        wanW: 0.5
    };
    $scope.preyStats = {
        speed: 1.5,
        cohW: 0.4,
        sepW: 0.4,
        aliW: 0.2,
        avoW: 1.0,
        wanW: 0.2
    };

    $scope.wolfOrZombie = "killPrey";
    $scope.wozDisplay = "Wolves!";

    $scope.killPrey = function() {
        $scope.predators.forEach(function(pred) {
            var toKill = MathUtils.getNearest($scope.herd, pred, 7);
            toKill.forEach(function(dead) {
                $scope.herd.splice($scope.herd.indexOf(dead), 1);
                console.log("Wolves got a kill! AWOOOO!");
            });
        });
    };

    $scope.turnToZombie = function() {
        $scope.predators.forEach(function(pred) {
            var toKill = MathUtils.getNearest($scope.herd, pred, 7);
            toKill.forEach(function(dead) {
                var options = {
                    pos: New(Vector, {x: dead.pos.x, y: dead.pos.y}),
                    vel: New(Vector, {x: dead.vel.x, y: dead.vel.y}),
                    speed: parseFloat($scope.predStats.speed), cohW: parseFloat($scope.predStats.cohW),
                    sepW: parseFloat($scope.predStats.sepW), aliW: parseFloat($scope.predStats.aliW), wanW: parseFloat($scope.predStats.wanW),
                    type: PREDATOR, color: DrawUtils.getRandomRed()
                };
                $scope.predators.push(New(Entity, options));
                $scope.herd.splice($scope.herd.indexOf(dead), 1);
                console.log("Oh no, they got Timmy!");
            });
        });
    };

    $scope.update = function () {
        $scope.predators.forEach(function (s) {
            s.update({
                box: $scope.box,
                herd: MathUtils.getNearest($scope.herd, s, 50.0),
                pred: $scope.predators
            });
        });
        $scope.herd.forEach(function (s) {
            s.update({
                box: $scope.box,
                herd: MathUtils.getNearest($scope.herd, s, 50.0),
                pred: MathUtils.getNearest($scope.predators, s, 50.0)
            });
        });

        $scope[$scope.wolfOrZombie]();
        $scope.preyAmtLeft = $scope.herd.length;
    };

    $scope.toggleWolfOrZombie = function() {
        if ($scope.wolfOrZombie == "killPrey") {
            $scope.wolfOrZombie = "turnToZombie";
            $scope.wozDisplay = "Zombies!";
        }
        else if ($scope.wolfOrZombie == "turnToZombie") {
            $scope.wolfOrZombie = "killPrey";
            $scope.wozDisplay = "Wolves!";
        }
        $scope.reset();
    };

    $scope.render = function () {
        DrawUtils.fillCanvas($scope.canvas, CAN_BACK);
        DrawUtils.drawGrid($scope.ctx, $scope.box, 50, GRID_COLOR);
        $scope.predators.forEach(function (s) {
            s.render($scope.ctx);
        });
        $scope.herd.forEach(function (s) {
            s.render($scope.ctx);
        });
    };

    $scope.reset = function() {
        $scope.herd = createHerd($scope.preyAmt);
        $scope.predators = createPredators($scope.predAmt);
    };

    $scope.clear = function() {
        $scope.herd = [];
        $scope.predators = [];
    };

    $scope.setStat = function(which, amt) {
        for(var x = 0; x < $scope.predators.length; x++){
            $scope.predators[x][which] = amt;
        }
        for(var y = 0; y < $scope.herd.length; y++){
            $scope.herd[y][which] = amt;
        }
    };

    // Animation
    window.requestAnimFrame = (function (callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    $scope.animate = function () {
        $scope.update();
        $scope.render();
        $scope.$apply();
        // request new frame
        requestAnimFrame(function () {
            $scope.animate();
        });
    };

    setTimeout(function () {
        $scope.animate();
    }, 0);

}]);
demoApp.controller('LifeCtrl', ['$scope', function ($scope) {
    // Common Objects/Definitions
    var CAN_BACK = "#222", GRID_COLOR = "#555";

    // Scope Fields
    $scope.canvas = $('#lifeCanvas')[0];
    $scope.box = {
        width: $scope.canvas.width,
        height: $scope.canvas.height,
        center: New(Vector, {x: $scope.canvas.width / 2, y: $scope.canvas.height / 2})
    };
    $scope.ctx = $scope.canvas.getContext('2d');
    $scope.generation = 1;
    $scope.step = 0.25;
    $scope.pause = false;
    $scope.gridObj = {
        grid: [],
        tileSize: 10
    };

    // Scope Functions
    $scope.generateGrid = function() {
        var de;
        $scope.gridObj = {
            grid: [],
            tileSize: 10
        };
        for(var y = 0; y < $scope.box.height / $scope.gridObj.tileSize; y++) {
            var arr = [];
            for(var x = 0; x < $scope.box.width / $scope.gridObj.tileSize; x++) {
                de = MathUtils.getRand(0, 1) < 0.1 ? true : false;
                arr.push((New(Cell, {
                    box: {
                        x: x * $scope.gridObj.tileSize,
                        y: y * $scope.gridObj.tileSize,
                        width: $scope.gridObj.tileSize,
                        height: $scope.gridObj.tileSize
                    },
                    status: de ? ALIVE : DEAD
                })));
            }
            $scope.gridObj.grid.push(arr);
        }
        fillNeighbors($scope.gridObj.grid);
    };

    $scope.update = function () {
        $scope.generation++;
        var copy = deepCopyGrid($scope.gridObj.grid);
        for(var y = 0; y < $scope.gridObj.grid.length; y++) {
            for(var x = 0; x < $scope.gridObj.grid[y].length; x++) {
                $scope.gridObj.grid[y][x].setStatus( copy[y][x].update() );
            }
        }
    };

    $scope.render = function () {
        DrawUtils.fillCanvas($scope.canvas, CAN_BACK);
        $scope.gridObj.grid.forEach(function(row) {
            row.forEach(function(node) {
                node.render($scope.ctx);
            });
        });

        DrawUtils.drawGrid($scope.ctx, $scope.box, $scope.gridObj.tileSize, GRID_COLOR);
    };

    $scope.reset = function() {
        $scope.generateGrid();
        $scope.generation = 1;
        $scope.render();
    };

    $scope.getPause = function() {
        if ($scope.pause)
            return "Resume";
        else
            return "Pause";
    };

    $scope.pauseToggle = function() {
        $scope.pause = !$scope.pause;
    };

    $scope.spawnCell = function(x, y) {
        var newX = Math.round(x / $scope.gridObj.tileSize) - 1,
            newY = Math.round(y / $scope.gridObj.tileSize) - 1;
        $scope.gridObj.grid[newY][newX].setStatus(ALIVE);
        $scope.render();
    };

    // Setup
    $scope.generateGrid();

    // Animation
    window.requestAnimFrame = (function (callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    $scope.animate = function (startTime) {
        var time = (new Date()).getTime() - startTime;
        if (time > $scope.step * 1000 && !$scope.pause) {
            startTime = (new Date()).getTime();
            $scope.update();
            $scope.render();
            $scope.$apply();
        }
        else if ($scope.pause) {
            startTime = (new Date()).getTime();
        }
        // request new frame
        requestAnimFrame(function () {
            $scope.animate(startTime);
        });
    };

    setTimeout(function () {
        var startTime = (new Date()).getTime();
        $scope.animate(startTime);
    }, 0);
}]);

demoApp.directive('ngCanvas', function () {
    return {
        restrict: "A",
        link: function (scope, element) {
            var drawing = false;
            element.bind('mousedown', function (event) {
                scope.spawnCell(event.offsetX - 1, event.offsetY - 1);
                drawing = true;
            });
            element.bind('mousemove', function (event) {
                if (drawing)
                    scope.spawnCell(event.offsetX - 1, event.offsetY - 1);
            });
            element.bind('mouseup', function (event) {
                drawing = false;
            });
        }
    };
});


demoApp.controller('ThreeCtrl', ['$scope', function ($scope) {
    // PRIVATE FIELDS
    var SCREEN_WIDTH = window.innerWidth,
        SCREEN_HEIGHT = window.innerHeight,
        VIEW_ANGLE = 55,
        ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
        NEAR = 1,
        FAR = 20000,
        IMAGE_DIR = "../../../images/";

    // PUBLIC FIELDS
    $scope.scene = null;
    $scope.camera = null;
    $scope.light = null;
    $scope.renderer = null;
    $scope.container = null;
    $scope.cube = null;
    $scope.skyBox = null;

    // PRIVATE METHODS
    var sceneInit = function() {
        $scope.scene = new THREE.Scene();
    };

    var cameraInit = function() {
        $scope.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        $scope.camera.position.z = 5;
        $scope.scene.add($scope.camera);
    };

    var lightInit = function() {
//        $scope.light = new THREE.DirectionalLight(0xffffff);
        $scope.light = new THREE.AmbientLight(0xffffff);
        $scope.light.position.set(0,0,0);
        $scope.scene.add($scope.light);
    };

    var rendererInit = function() {
        $scope.renderer = new THREE.WebGLRenderer();
        $scope.renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
        $scope.container = $("#ThreeJSDemo")[0];
        $scope.container.appendChild( $scope.renderer.domElement );
    };

    var eventInit = function() {
        THREEx.WindowResize($scope.renderer, $scope.camera);
        THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
    };

    var makeSkyMaterial = function() {
        var imagePrefix = IMAGE_DIR + "autumn-";
        var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
        var imageSuffix = ".png";

        var materialArray = [];
        for (var i = 0; i < 6; i++)
            materialArray.push( new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
                side: THREE.BackSide
            }));
        return new THREE.MeshFaceMaterial( materialArray );
    };

    var makeGlowMaterial = function(imageName) {
        var spriteMaterial = new THREE.SpriteMaterial(
            {
                map: new THREE.ImageUtils.loadTexture( IMAGE_DIR +  imageName ),
                useScreenCoordinates: false, alignment: new THREE.Vector2( 0, 0 ),
                color: 0x0000ff, transparent: true, blending: THREE.AdditiveBlending
            });
        var sprite = new THREE.Sprite( spriteMaterial );
        sprite.scale.set(1, 1, 1.0);
        return sprite;
    };

    var makeMaterial = function(imageName) {
        var image = IMAGE_DIR + imageName;
        var materialArray = [];
        for (var i = 0; i < 6; i++)
            materialArray.push( new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture( image ),
                side: THREE.BackSide
            }));
        return new THREE.MeshFaceMaterial( materialArray );
    };

    var makeCube = function() {
        var geometry = new THREE.BoxGeometry(1,1,1);
        $scope.cube = new THREE.Mesh( geometry, makeMaterial("blue-glowy.jpg") );
        $scope.cube.add(makeGlowMaterial("glow.png"));
        $scope.cube.position.z = -10;
        $scope.scene.add( $scope.cube );
    };

    var makeSkyBox = function() {
        var skyGeometry = new THREE.BoxGeometry( 10000, 10000, 10000 );
        $scope.skyBox = new THREE.Mesh( skyGeometry, makeSkyMaterial() );
        $scope.scene.add( $scope.skyBox );
    };

    var init = function() {
        sceneInit();
        cameraInit();
        lightInit();
        rendererInit();
        eventInit();
        makeCube();
        makeSkyBox();
    };


    // PUBLIC METHODS
    $scope.update = function() {
        $scope.cube.rotation.x += 0.01;
        $scope.cube.rotation.y += 0.01;
    };

    $scope.render = function() {
        $scope.renderer.render($scope.scene, $scope.camera);
    };



    // ANIMATION
    window.requestAnimFrame = (function (callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    $scope.animate = function () {
        $scope.update();
        $scope.render();
        $scope.$apply();
        // request new frame
        requestAnimFrame(function () {
            $scope.animate();
        });
    };

    setTimeout(function () {
        $scope.animate();
    }, 0);


    init();
}]);