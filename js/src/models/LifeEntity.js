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