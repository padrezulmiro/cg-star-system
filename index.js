import * as twgl from "./node_modules/twgl.js/dist/5.x/twgl-full.module.js"
import {config} from "./star-config.js"
import {
    vsDirect,
    fsDirect
} from "./shaders.js"
import * as cam from "./camera.js"

// grabbing webgl references
const m4 = twgl.m4
const v3 = twgl.v3
const primitives = twgl.primitives
const gl = document.querySelector("canvas").getContext("webgl");
const CANVAS = document.querySelector("canvas")
const programInfo = twgl.createProgramInfo(gl, [vsDirect, fsDirect])

// setting up vertexes for the primitive
const bufferInfo = twgl.primitives.createSphereBufferInfo(gl,1,24,24);
const uniforms = {};

gl.clearColor(0, 0, 0.2, 1);  // background color

// ========== INITIAL CAM config ==========
const eye = [0, 0, 10];
const target = [0, 0, 0];
const up = [0, 1, 0];
var cameraConfig = new cam.Camera(eye,target,up);
var camera = cameraConfig.camera;


// ========== MOUSE EVENTS ==========
// ref: http://www.webglacademy.com/courses.php?courses=0_1_20_2_3_4_23_5_6_7_10#4
var drag = false;
var THETA = 0, PHI = 0;

var x_prev, y_prev;

var rt_dX = 0, rt_dY = 0;
var mouseDown = function(e) {
  drag = true;
  x_prev = e.pageX, y_prev = e.pageY;
  e.preventDefault();
  return false;
};

var mouseUp = function(e){
  drag = false;
};

var mouseMove = function(e) {
  if (!drag) return false;
    rt_dX = (e.pageX-x_prev) * 2 * Math.PI / CANVAS.width,
    rt_dY = (e.pageY-y_prev) * 2 * Math.PI / CANVAS.height;
    THETA += rt_dX;
    PHI += rt_dY;
    x_prev = e.pageX, y_prev = e.pageY;
    e.preventDefault();
};



CANVAS.addEventListener("mousedown", mouseDown, false);
CANVAS.addEventListener("mouseup", mouseUp, false);
CANVAS.addEventListener("mouseout", mouseUp, false);
CANVAS.addEventListener("mousemove", mouseMove, false);

// ========== KB EVENTS ==========
var mv_dX = 0, mv_dZ = 0; //dX short for DYKES I <3 WOMEN
// var u = [1, 0, 0]; //+X axis
// var v = [0, 1, 0]; //+Y axis
// var n = [0, 0, 1]; //+Z axis
var AMORTIZATION = 0.5; //bit of a slowdown so movement isn't so immediate.
var LOWER_BOUND = 0.01; //stops calculating at this bound
var is_key_down = false;
var keyDown = function(e){
    is_key_down =true;
    switch (e.keyCode) {
        case 37: //left
            // console.log("left");
            mv_dX = -1;
            break;
        case 38: //up
            // console.log("forward");
            mv_dZ = -1;
            break;
        case 39: //right
            // console.log("right");
            mv_dX = 1;
            break;
        case 40: //down
            // console.log("back");
            mv_dZ = 1;
            break;
        case 48: //0
            //return to look at origin
            cameraConfig.moveCameraToTarget(eye,target,up);
            break;
        case 49: //1
            //point at earth
            break;
        case 50: //2
            //point at sun
            break;
    }
    // console.log("x:",mv_dX,"  z:",mv_dZ);
};

var keyUp = function(e){
    is_key_down = false
};

document.addEventListener("keydown", keyDown, false);
document.addEventListener("keyup", keyUp, false);


// ========== FINALLY: BEGIN RENDER ==========
requestAnimationFrame(render);

function render(time) {
    //*********************************** to calculate movement
    var movement = [mv_dX,0,mv_dZ];
    // console.log("movement:",movement, " key:", is_key_down);
    if(!is_key_down){
        if (Math.abs(mv_dX) <= LOWER_BOUND){mv_dX = 0};
        if (Math.abs(mv_dZ) <= LOWER_BOUND){mv_dZ = 0};
        mv_dX*=AMORTIZATION;
        mv_dZ*=AMORTIZATION;
    }
    //***********************************

    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fov = 30 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.5;
    const zFar = 100;
    const projection = m4.perspective(fov, aspect, zNear, zFar);


    //*********************************** camera calculations

    // var pointing_at = v3.normalize(cameraConfig.getDirection(camera));
    // // console.log('pointing',pointing_at);
    // // console.log('pre-direction oriented movement:', movement);
    // movement = v3.multiply(pointing_at,movement);//m4.transformDirection(pointing_at,movement);
    // // // movement = m4.transformDirection(pointing_at,movement);
    // console.log('movement:', movement);
    // camera = m4.translate(camera,movement);
    // // console.log('aftertranslation,',camera);

    console.log('camera movement:', movement);
    // var movement_world = cameraConfig.v_CamToWorldSpace(camera,movement);
    // console.log('world movement:', movement_world);

    cameraConfig.moveCameraByV(movement);//m4.translate(camera,movement_world);
    // console.log('camera:', camera);

    //rotation
    cameraConfig.turnCamera(rt_dX,rt_dY); //turning camera based on mouse movement
    rt_dX = 0;
    rt_dY = 0;
    const view = m4.inverse(cameraConfig.camera);
    //***********************************

    const viewProjection = m4.multiply(projection, view);
    const world = m4.identity();//m4.rotationY(time*0.001);

    uniforms.u_world = world;
    uniforms.u_worldViewProjection = m4.multiply(viewProjection, world);

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(gl, bufferInfo);

    requestAnimationFrame(render);
}

function initGL(gl) {}

// calculate the vector of target and eye
// normalize it for the direction
// multiply it with the arrow key directions of the frame.
//
