describe("Food Model", function () {
    var Food, DrawUtils, Vector,
        defaultOptions;

    beforeEach(function () {
        module('aidemo.service.drawUtils', 'aidemo.models.vector', 'aidemo.models.ants.food');

        inject(function (_Food_, _DrawUtils_, _Vector_) {
            Food = _Food_;
            DrawUtils = _DrawUtils_;
            Vector = _Vector_;

            defaultOptions = {
                position: new Vector({x: 10, y: 20})
            };
        });
    });

    it("should instantiate properly", function () {
        var green = '#00AA00';

        spyOn(DrawUtils, 'getRandomGreen').and.callFake(function (min) {
            expect(min).toBe('A');
            return green;
        });

        var food = new Food(defaultOptions);

        expect(DrawUtils.getRandomGreen).toHaveBeenCalled();
        expect(food.position).toBe(defaultOptions.position);
        expect(food.radius).toBe(10.0);
        expect(food.color).toBe(green);
    });

    it("should have a bite taken from it and return whether or not it is gone", function () {
        var food = new Food(defaultOptions);

        food.radius = 0.2;

        var result = food.takeBite();

        expect(result).toBeFalsy();


        result = food.takeBite();

        expect(result).toBeTruthy();
    });

    it("should render itself", function () {
        var green = '#00AA00';

        spyOn(DrawUtils, 'getRandomGreen').and.callFake(function (min) {
            return green;
        });

        var food = new Food(defaultOptions),
            context = document.createElement("canvas").getContext('2d');

        spyOn(DrawUtils, 'drawCircle').and.callFake(function (ctx, x, y, radius, color) {
            expect(ctx).toBe(context);
            expect(x).toBe(food.position.x);
            expect(y).toBe(food.position.y);
            expect(radius).toBe(food.radius);
            expect(color).toBe(green);
        });

        food.render(context);

        expect(DrawUtils.drawCircle.calls.count()).toBe(1);
    });
});