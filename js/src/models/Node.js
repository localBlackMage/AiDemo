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