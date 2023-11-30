import * as twgl from "./node_modules/twgl.js/dist/5.x/twgl-full.module.js"
import {config} from "./star-config.js"
import {
    vsDirect,
    fsDirect
} from "./shaders.js"

// grabbing webgl references
const m4 = twgl.m4
const primitives = twgl.primitives
const gl = document.querySelector("canvas").getContext("webgl");
const programInfo = twgl.createProgramInfo(gl, [vsDirect, fsDirect])

// setting up vertexes for the primitive
const bufferInfo = twgl.primitives.createSphereBufferInfo(gl,1,16,8);
const uniforms = {};

gl.clearColor(0, 0, 0.2, 1);  // background color
requestAnimationFrame(render);


function render(time) {
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fov = 30 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.5;
    const zFar = 10;
    const projection = m4.perspective(fov, aspect, zNear, zFar);

    const eye = [0, 0, -10];
    const target = [0, 0, 0];
    const up = [0, 1, 0];
    const camera = m4.lookAt(eye, target, up);
    const view = m4.inverse(camera);

    const viewProjection = m4.multiply(projection, view);
    const world = m4.rotationY(time*0.001);//m4.identity();

    uniforms.u_world = world;
    uniforms.u_worldViewProjection = m4.multiply(viewProjection, world);

    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(gl, bufferInfo);

    requestAnimationFrame(render);
}

function initGL(gl) {}

// function render(step) {}
