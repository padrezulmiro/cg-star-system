"use strict";

import * as twgl from "./node_modules/twgl.js/dist/5.x/twgl-full.module.js"
import {config} from "./star-config.js"
import {
    vsDirect,
    fsDirect
} from "./shaders.js"

// grabbing webgl references
const m4 = twgl.m4
const primitives = twgl.primitives
const v3 = twgl.v3

/** @type {HTMLCanvasElement}*/
const canvas = document.querySelector("canvas")
/** @type {WebGLRenderingContext}*/
const gl = canvas.getContext("webgl");

const programInfo = twgl.createProgramInfo(gl, [vsDirect, fsDirect])

const bufferInfos = generateBufferInfos(gl, config.bodies)

gl.clearColor(0, 0, 0, 1);  // background color
requestAnimationFrame(render);

function render(time) {
    twgl.resizeCanvasToDisplaySize(canvas);
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const fov = 30 * Math.PI / 180;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const zNear = 0.5;
    const zFar = 20;
    const projection = m4.perspective(fov, aspect, zNear, zFar);

    const eye = [0, 0, -13];
    const target = [0, 0, 0];
    const up = [0, 1, 0];
    const camera = m4.lookAt(eye, target, up);
    const view = m4.inverse(camera);

    const viewProjection = m4.multiply(projection, view);

    drawPlanets(gl, programInfo, bufferInfos, viewProjection, time)

    requestAnimationFrame(render);
}

function generateBufferInfos(gl, planets) {
    const bufferInfos = {}

    for (const planet in planets) {
        bufferInfos[planets[planet].name] =
            primitives.createSphereBufferInfo(gl, planets[planet].radius, 32, 32)
    }

    return bufferInfos
}

function drawPlanets(gl, programInfo, bufferInfos, viewProjection, time) {
    const planets = config.bodies
    const step = time * 0.001

    for (const info in bufferInfos) {
        gl.useProgram(programInfo.program);
        twgl.setBuffersAndAttributes(gl, programInfo, bufferInfos[info]);

        const translationVector = v3.create(
            planets[info].pos[0],
            planets[info].pos[1],
            planets[info].pos[2])

        if (info == "kerbin") {
            const x = v3.create(0, 0, 0)
        }

        let matrix = m4.translate(viewProjection, translationVector)

        const uniforms = {}
        uniforms.u_matrix = matrix

        twgl.setUniforms(programInfo, uniforms);
        twgl.drawBufferInfo(gl, bufferInfos[info]);
    }
}

function ellipseTranslation()
