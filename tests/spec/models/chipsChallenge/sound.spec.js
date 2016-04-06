describe("Sound Model", function () {
    'use strict';
    var defaultSound, Sound, createElementItems, angularElementSpy;
    beforeEach(function () {
        module('aidemo.models.chip.sound');

        inject(function (_Sound_) {
            Sound = _Sound_;

            defaultSound = {
                soundFile: Sound.DEATH
            };
        });

        createElementItems = {
            "<audio />": {
                appendChild: function(){},
                load: function(){},
                play: function(){}
            },
            "<source />": {
                src: ''
            }
        };
        angularElementSpy = spyOn(angular, 'element').and.callFake(function (type) {
            return createElementItems[type];
        });
    });

    afterEach(function() {
        angularElementSpy.and.callThrough();
    });

    it('should instantiate properly', function () {

        spyOn(createElementItems["<audio />"], 'appendChild').and.callFake(function (ele) {
            expect(ele).toBe(createElementItems[["<source />"]]);
            expect(ele.src).toBe(defaultSound.soundFile + '.mp3');
        });
        spyOn(createElementItems["<audio />"], 'load').and.callThrough();

        var sound = new Sound(defaultSound);

        expect(sound.soundFile).toBe(Sound.DEATH);
        expect(sound.audioElement).toBe(createElementItems["<audio />"]);
        expect(sound.audioElement.preload).toBe("auto");
        expect(sound.audioElement.volume).toBe(1.0);
        expect(sound.audioElement.appendChild).toHaveBeenCalled();
        expect(sound.audioElement.load).toHaveBeenCalled();
    });

    it('should throw an error if a type is not provided', function () {
        expect(function () {
            var sound = new Sound();
        })
            .toThrow(new Error("ERROR INSTANTIATING SOUND: MUST HAVE A SOUNDFILE"));
    });

    it('should play the sound', function () {
        var sound = new Sound(defaultSound);

        spyOn(sound.audioElement, "play").and.callFake(function(){});

        sound.play(0);

        expect(sound.audioElement.currentTime).toBe(0);
        expect(sound.audioElement.play).toHaveBeenCalled();
    });
});