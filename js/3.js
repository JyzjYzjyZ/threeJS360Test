"use strict";
function draw(ViewElement) {
    var camera,
        scene,
        element = document.getElementById(ViewElement.id), // Inject scene into this
        renderer,
        onPointerDownPointerX,
        onPointerDownPointerY,
        onPointerDownLon,
        onPointerDownLat,
        fov = 70, // Field of View
        isUserInteracting = false,
        lon = 0,
        lat = 0,
        phi = 0,
        theta = 0,
        onMouseDownMouseX = 0,
        onMouseDownMouseY = 0,
        onMouseDownLon = 0,
        onMouseDownLat = 0,
        width = ViewElement.width, // int || window.innerWidth
        height = ViewElement.height, // int || window.innerHeight
        ratio = width / height;
    var texture = THREE.ImageUtils.loadTexture(ViewElement.imgLoad, new THREE.UVMapping(), function() {
        init();
        animate();
    });
    function init() {
        camera = new THREE.PerspectiveCamera(fov, ratio, 1, 1000);
        scene = new THREE.Scene();
        var mesh = new THREE.Mesh(new THREE.SphereGeometry(500, 60, 40), new THREE.MeshBasicMaterial({map: texture}));
        mesh.scale.x = -1;
        scene.add(mesh);
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(width, height);
        element.appendChild(renderer.domElement);
        element.addEventListener('mousedown', onDocumentMouseDown, false);
        element.addEventListener('mousewheel', onDocumentMouseWheel, false);
        element.addEventListener('DOMMouseScroll', onDocumentMouseWheel, false);
        window.addEventListener('resize', onWindowResized, false);
        onWindowResized(null);
    }
    function onWindowResized(event) {
//    renderer.setSize(window.innerWidth, window.innerHeight);
//    camera.projectionMatrix.makePerspective(fov, window.innerWidth / window.innerHeight, 1, 1100);
        renderer.setSize(width, height);
        camera.projectionMatrix.makePerspective(fov, ratio, 1, 1100);
    }
    function onDocumentMouseDown(event) {
        event.preventDefault();
        onPointerDownPointerX = event.clientX;
        onPointerDownPointerY = event.clientY;
        onPointerDownLon = lon;
        onPointerDownLat = lat;
        isUserInteracting = true;
        element.addEventListener('mousemove', onDocumentMouseMove, false);
        element.addEventListener('mouseup', onDocumentMouseUp, false);
    }
    function onDocumentMouseMove(event) {
        lon = (event.clientX - onPointerDownPointerX) * -0.175 + onPointerDownLon;
        lat = (event.clientY - onPointerDownPointerY) * -0.175 + onPointerDownLat;
    }
    function onDocumentMouseUp(event) {
        isUserInteracting = false;
        element.removeEventListener('mousemove', onDocumentMouseMove, false);
        element.removeEventListener('mouseup', onDocumentMouseUp, false);
    }
    function onDocumentMouseWheel(event) {
        // WebKit
        if (event.wheelDeltaY) {
            fov -= event.wheelDeltaY * 0.05;
            // Opera / Explorer 9
        } else if (event.wheelDelta) {
            fov -= event.wheelDelta * 0.05;
            // Firefox
        } else if (event.detail) {
            fov += event.detail * 1.0;
        }
        if (fov < 45 || fov > 90) {
            fov = (fov < 45) ? 45 : 90;
        }
        camera.projectionMatrix.makePerspective(fov, ratio, 1, 1100);
    }
    function animate() {
        requestAnimationFrame(animate);
        render();
    }
    function render() {
        if (isUserInteracting === false) {
            lon += .05;
        }
        lat = Math.max(-85, Math.min(85, lat));
        phi = THREE.Math.degToRad(90 - lat);
        theta = THREE.Math.degToRad(lon);
        camera.position.x = 100 * Math.sin(phi) * Math.cos(theta);
        camera.position.y = 100 * Math.cos(phi);
        camera.position.z = 100 * Math.sin(phi) * Math.sin(theta);
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }
}

var ArrViewElement = new Array(),
    ArrFoldContentWidth = new Array();
var windowSizeX,
    windowSizeY;
var contentWidth;

function test(){
    var Arr = document.body.getElementsByClassName("view");
    //console.log(Arr);
    windowSizeX = window.innerWidth;
    windowSizeY = window.innerHeight;
    contentWidth = document.getElementById('contentWidthForJs').offsetWidth;
    //var ArrIdRemember = ["Left","Content","Right"];
    ArrFoldContentWidth[0] = document.getElementById('foldContent'+'Left').offsetWidth;
    ArrFoldContentWidth[1] = document.getElementById('foldContent'+'Centre').offsetWidth;
    ArrFoldContentWidth[2] = document.getElementById('foldContent'+'Right').offsetWidth;
    for (var i = 0;i < Arr.length;i++){
        ArrViewElement[i] = {element:Arr[i],
            id: Arr[i].id,
            imgLoad:'./img/'+Arr[i].id+'.jpg',
            width: 1440,
            height: 660}
        //==>
        //alert("bad");
        setViewHighWide(ArrViewElement[i].id,i);

        draw(ArrViewElement[i]);
    }
    //return for
    console.log(ArrViewElement);
}

function setViewHighWide(strID,i) {
    //alert('good');
    if (strID === "homPageMainView"){ArrViewElement[i].width = windowSizeX;ArrViewElement[i].height = windowSizeX*0.35}
    else if (strID === "foldViewLeft"){ArrViewElement[i].width = ArrFoldContentWidth[0];ArrViewElement[i].height = ArrFoldContentWidth[1]*0.5}
    else if (strID === "foldViewCentre"){ArrViewElement[i].width = ArrFoldContentWidth[1];ArrViewElement[i].height = ArrFoldContentWidth[1]*0.5}
    else if (strID === "foldViewRight"){ArrViewElement[i].width = ArrFoldContentWidth[2];ArrViewElement[i].height = ArrFoldContentWidth[1]*0.5}
}

