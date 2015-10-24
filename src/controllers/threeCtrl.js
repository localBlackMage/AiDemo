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