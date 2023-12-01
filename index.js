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

    const eye = [0, 0, -16];
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

        let translationVector = v3.create(
            planets[info].pos[0],
            planets[info].pos[1],
            planets[info].pos[2])

        if (info == "kerbin") {
            let x = v3.create(-2, 0, 0)
            let majAxis = v3.create(6, 0, 0)
            let minAxis = v3.create(0, 4, 0)
            majAxis = v3.mulScalar(majAxis, Math.cos(step))
            minAxis = v3.mulScalar(minAxis, Math.sin(step))
            x = v3.add(x, majAxis)
            x = v3.add(x, minAxis)
            translationVector = x
        }

        let matrix = m4.translate(viewProjection, translationVector)

        const uniforms = {}
        uniforms.u_matrix = matrix

        twgl.setUniforms(programInfo, uniforms);
        twgl.drawBufferInfo(gl, bufferInfos[info]);
    }
}

function ellipseTranslationVector(planetName, time) {
    /*
     * See https://en.wikipedia.org/wiki/Ellipse#/media/File:Ellipse-param.svg
     * a = c + k where k is the distance between vertex and orbited planet
     *
     * This vertex will be the starting position of the planet
     */
    const planets = config.bodies
    const planet = planets[planetName]
    const orbited = planets[planet.orbit.around]

    const planetPos = v3.create(planet.pos[0], planet.pos[1], planet.pos[2])
    const orbitedPos = v3.create(orbited.pos[0], orbited.pos[1], orbited.pos[2])

    const orbitedPlanetVec = v3.subtract(planetPos, orbitedPos)
    const orbitedPlanetDistance = v3.distance(orbitedPlanetVec)
    const centerOrbitedDistance =
          (planet.orbit.eccentricity / (1 - planet.orbit.eccentricity)) *
          orbitedPlanetDistance
    const orbitedPlanetUnitVector = v3.normalize(orbitedPlanetVec)
    const centerOrbitedVec = v3.mulScalar(
        orbitedPlanetUnitVector,
        centerOrbitedDistance)
    const centerPos = v3.subtract(orbitedPos, centerOrbitedVec)

    const majorAxis = v3.subtract(planetPos, centerPos)


}
