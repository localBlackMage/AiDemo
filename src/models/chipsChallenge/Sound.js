(function (ng) {
    'use strict';

    ng.module('aidemo.models.chip.sound', [])
        .factory('Sound', [], function () {


            function Sound(params) {
                params = params || {};

                this.soundFile = params.soundFile ? params.soundFile : null;
                if (this.soundFile === null) {
                    return "ERROR INSTANTIATING SOUND";
                }

                this.audioElement = document.createElement("audio");
                this.audioElement.preload = "auto";

                var src = document.createElement("source");
                src.src = this.soundFile + ".mp3";
                this.audioElement.appendChild(src);
                this.audioElement.load();
                this.audioElement.volume = 1.0;
            }

            var soundRoot = "sounds/";
            Sound.SOUNDS = {
                DEATH: soundRoot + "death"
            };

            Sound.prototype.play = function (when) {
                this.audioElement.currentTime = when !== null ? when : 0.01;

//        setTimeout(function(){
                this.audioElement.play();
//        },1);
            };
        });
})(angular);