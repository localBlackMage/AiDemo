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