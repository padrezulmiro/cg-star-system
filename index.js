import * as twgl from "./node_modules/twgl.js/dist/5.x/twgl-full.module.js"
import {config} from "./star-config.js"
import {
    vsDirect,
    fsDirect
} from "./shaders.js"
import * as cam from "./camera.js"

// grabbing webgl references
const m4 = twgl.m4
const primitives = twgl.primitives
const gl = document.querySelector("canvas").getContext("webgl");
const CANVAS = document.querySelector("canvas")
const programInfo = twgl.createProgramInfo(gl, [vsDirect, fsDirect])

// setting up vertexes for the primitive
const bufferInfo = twgl.primitives.createSphereBufferInfo(gl,1,24,24);
const uniforms = {};

gl.clearColor(0, 0, 0.2, 1);  // background color

// ========== INITIAL CAM config ==========
var eye = [0, 0, -10];
var target = [0, 0, 0];
var up = [0, 1, 0];
var camera = m4.lookAt(eye, target, up);

// ========== MOUSE EVENTS ==========
// ref: http://www.webglacademy.com/courses.php?courses=0_1_20_2_3_4_23_5_6_7_10#4
var drag = false;
var THETA = 0, PHI = 0;

var x_prev, y_prev;

var dX = 0, dY = 0;
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
  dX = (e.pageX-x_prev) * 2 * Math.PI / CANVAS.width,
    dY = (e.pageY-y_prev) * 2 * Math.PI / CANVAS.height;
  THETA += dX;
  PHI += dY;
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
    // console.log('THETA:',THETA, 'PHI:', PHI);
    var movement = [mv_dX,0,mv_dZ];
    console.log("movement:",movement, " key:", is_key_down);
    if(!is_key_down){
        if (Math.abs(mv_dX) <= LOWER_BOUND){mv_dX = 0};
        if (Math.abs(mv_dZ) <= LOWER_BOUND){mv_dZ = 0};
        mv_dX*=AMORTIZATION;
        mv_dZ*=AMORTIZATION;
    }
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

    // eye[0] = mv_dX;
    // eye[2] = mv_dZ;
    camera = m4.translate(camera,movement);
    // dst[12] = eye[0];
    // dst[13] = eye[1];
    // dst[14] = eye[2];
    const turned_camera = cam.turnCamera(m4,camera,eye,THETA,PHI); //turning camera based on mouse movement
    const view = m4.inverse(turned_camera);

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
