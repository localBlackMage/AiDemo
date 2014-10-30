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
        id: null, pos: New(Vector, {}),
        distance: 0, box: {}, neighbors: [],
        selected: false, special: false, path: false
    },

    constructor: function (options) {
        this.id = IsNotNullOrUndefined(options.id) ? options.id : this.options.id;
        this.pos = IsNotNullOrUndefined(options.pos) ? options.pos : this.options.pos;
        this.distance = IsNotNullOrUndefined(options.distance) ? options.distance : this.options.distance;
        this.box = IsNotNullOrUndefined(options.box) ? options.box : this.options.box;

        this.neighbors = IsNotNullOrUndefined(options.neighbors) ? options.neighbors : this.options.neighbors;
        this.selected = IsNotNullOrUndefined(options.selected) ? options.selected : this.options.selected;
        this.special = IsNotNullOrUndefined(options.special) ? options.special : this.options.special;
        this.path = IsNotNullOrUndefined(options.path) ? options.path : this.options.path;
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

    getColor: function () {
        if (this.special)
            return SPECIAL_COLOR;
        else if (this.path)
            return PATH_COLOR;
        else if (this.selected)
            return SELECTED_COLOR;
        else
            return RENDER_COLOR;
    },

    render: function (ctx) {
        DrawUtils.drawText(ctx, this.pos.x+10, this.pos.y-10, SELECTED_COLOR, this.id.toString());
        DrawUtils.drawCircle(ctx, this.pos.x, this.pos.y, 5, this.getColor());
    }
};