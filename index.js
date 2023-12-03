"use strict";

import * as twgl from "./node_modules/twgl.js/dist/5.x/twgl-full.module.js"
import {config} from "./star-config.js"
import {
    vsDirect,
    fsDirect,
    vsPhong,
    fsPhong,
    vsGouraud,
    fsGouraud
} from "./shaders.js"
import * as cam from "./camera.js"

// grabbing webgl references
const m4 = twgl.m4
const v3 = twgl.v3
const primitives = twgl.primitives

/** @type {WebGLRenderingContext}*/
const gl = document.querySelector("canvas").getContext("webgl");
/** @type {HTMLCanvasElement}*/
const canvas = document.querySelector("canvas")

const programInfoNoShading = twgl.createProgramInfo(gl, [vsDirect, fsDirect])
const programInfoPhong = twgl.createProgramInfo(gl, [vsPhong, fsPhong])
const programInfoGouraud = twgl.createProgramInfo(gl, [vsGouraud, fsGouraud])
var shadingMode = programInfoPhong;

const bufferInfos = generateBufferInfos(gl, config.bodies);
const textureInfos = generateTextureInfos(gl,config.bodies);

gl.clearColor(0, 0, 0.2, 1);  // background color

// ========== BINDING SHADERS ==========
// image.addEventListener('load', function() {
//     // Now that the image has loaded make copy it to the texture.
//     gl.bindTexture(gl.TEXTURE_2D, texture);
//     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
//     gl.generateMipmap(gl.TEXTURE_2D);
//   });
  

// ========== INITIAL CAM config ==========
const eye = [0, 0, 50];
const target = [0, 0, 0];
const up = [0, 1, 0];
var cameraConfig = new cam.Camera(eye,target,up);
var camera = cameraConfig.camera;


// ========== MOUSE EVENTS ==========
// ref: http://www.webglacademy.com/courses.php?courses=0_1_20_2_3_4_23_5_6_7_10#4
var drag = false;
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
    rt_dX = (e.pageX-x_prev) * 0.5 * Math.PI / canvas.width,
    rt_dY = (e.pageY-y_prev) * 0.5 * Math.PI / canvas.height;
    // THETA += rt_dX;
    // PHI += rt_dY;
    x_prev = e.pageX, y_prev = e.pageY;
    e.preventDefault();
};

canvas.addEventListener("mousedown", mouseDown, false);
canvas.addEventListener("mouseup", mouseUp, false);
canvas.addEventListener("mouseout", mouseUp, false);
canvas.addEventListener("mousemove", mouseMove, false);

// ========== KB EVENTS ==========
var mv_dX = 0, mv_dZ = 0; //dX short for DYKES I <3 WOMEN
var AMORTIZATION = 0.5; //bit of a slowdown so movement isn't so immediate.
var LOWER_BOUND = 0.01; //stops calculating at this bound
var is_key_down = false;
var keyDown = function(e){
    is_key_down =true;
    switch (e.keyCode) {
        case 37: //left
            mv_dX = -1;
            break;
        case 38: //up
            mv_dZ = -1;
            break;
        case 39: //right
            mv_dX = 1;
            break;
        case 40: //down
            mv_dZ = 1;
            break;
        case 48: //0
            //return to look at origin
            cameraConfig.moveCameraToTarget(eye,target,up);
            break;
        case 49: //1
            //FIXME: point at earth
            break;
        case 50: //2
            //FIXME: point at sun
            break;
        case 71: //G
            //change to gouraud
            shadingMode = programInfoGouraud;
            break;
        case 78: //N
            //change to none
            shadingMode = programInfoNoShading;
            break;
        case 80: //P
            //change to phong
            shadingMode = programInfoPhong;
            break;
    }
};

var keyUp = function(e){
    is_key_down = false
};

document.addEventListener("keydown", keyDown, false);
document.addEventListener("keyup", keyUp, false);


// ========== FINALLY: BEGIN RENDER ==========
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
    const zFar = 1000;
    const projection = m4.perspective(fov, aspect, zNear, zFar);


    //***********************************
    //calculate movement
    var movement = [mv_dX,0,mv_dZ];
    if(!is_key_down){
        if (Math.abs(mv_dX) <= LOWER_BOUND){mv_dX = 0};
        if (Math.abs(mv_dZ) <= LOWER_BOUND){mv_dZ = 0};
        mv_dX*=AMORTIZATION;
        mv_dZ*=AMORTIZATION;
    }
    cameraConfig.moveCameraByV(movement); 
    //calculate rotation
    cameraConfig.turnCamera(rt_dX,rt_dY); //turning camera based on mouse movement
    rt_dX = 0;
    rt_dY = 0;
    const view = m4.inverse(cameraConfig.camera);
    //***********************************

    // const viewProjection = m4.multiply(projection, view);
    // const world = m4.identity();

    // drawPlanets(gl, programInfoPhong, bufferInfos, textureInfos, view, projection, time);
    drawPlanets(gl, shadingMode, bufferInfos, textureInfos, view, projection, time);

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

function generateTextureInfos(gl,planets){
    const textureInfos = {}
    for (const planet in planets){
        const img = new Image();
        img.src = planets[planet].texture;
        img.addEventListener('load', function() {
            console.log("done loading: ",img.src);
            textureInfos[planets[planet].name] = twgl.createTexture(gl, {src: img});
          });
    }
    return textureInfos
} 

function drawPlanets(gl, programInfo, bufferInfos, textureInfos, view, projection,time) {
    const planets = config.bodies
    const step = time * 0.001
    for (const info in bufferInfos) {
        if(info == "kerbol"){ //if its the sun, no shaders
            drawPlanet(gl,planets,info,programInfoNoShading,bufferInfos[info],textureInfos[info],view,projection,time);
        }
        else{ //otherwise use whatever's provided
            drawPlanet(gl,planets,info,programInfo,bufferInfos[info],textureInfos[info],view,projection,time);
        }
    }
}




function drawPlanet(gl,planets,info,programInfo, bufferInfo, textureInfo, view, projection,time){
    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);

    let translationVector = v3.create(
        planets[info].pos[0],
        planets[info].pos[1],
        planets[info].pos[2])

    if (info != "kerbol") {
        translationVector = ellipseTranslationVector(info, time)
    }

    const world = m4.identity();
    const viewProjection = m4.multiply(projection, view);

    const uniforms = {};
    uniforms.u_worldViewProjection = m4.translate(viewProjection, translationVector); //m4.multiply(matrix,world);
    uniforms.u_texture = textureInfo;
    
    if (programInfo == programInfoPhong || programInfo == programInfoGouraud){
        uniforms.u_modelview = m4.translation(translationVector);//m4.multiply(view,matrix);
        uniforms.u_worldInverseTranspose = m4.transpose(m4.inverse(world));
        uniforms.Ka = 1;
        uniforms.Kd = 1;
        uniforms.Ks = 0.5;
        uniforms.shininessVal = 10;
        uniforms.ambientColor = [0, 0, 0, 1];  // black
        uniforms.diffuseColor = [0,0,0,1];     // not super necessary since there will be textures
        uniforms.specularColor = [1, 1, 1, 1]; // white
        uniforms.lightPos = [0,0,0]; // light position
    }
    twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(gl, bufferInfo);
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
    const orbitedPlanetDistance = v3.length(orbitedPlanetVec)
    const orbitedPlanetUnitVector = v3.normalize(orbitedPlanetVec)

    const centerOrbitedDistance =
          (planet.orbit.eccentricity / (1 - planet.orbit.eccentricity)) *
          orbitedPlanetDistance
    const centerOrbitedVec = v3.mulScalar(
        orbitedPlanetUnitVector,
        centerOrbitedDistance
    )

    const centerPos = v3.subtract(orbitedPos, centerOrbitedVec)
    let majorAxis = v3.subtract(planetPos, centerPos)
    const majorAxisDistance = v3.length(majorAxis)

    const perpendicularUnitVec = standardPerpendicular(majorAxis)
    const minAxisDistance = Math.sqrt(
        Math.pow(majorAxisDistance, 2) -
        Math.pow(centerOrbitedDistance, 2)
    )
    const unrotatedMinAxis = v3.mulScalar(perpendicularUnitVec, minAxisDistance)

    const rotationMatrix =
          m4.axisRotation(majorAxis, planet.orbit.ellipseRotation)
    let minAxis = m4.transformDirection(rotationMatrix, unrotatedMinAxis)

    const step = time * 0.001
    majorAxis = v3.mulScalar(majorAxis, Math.cos(step))
    minAxis = v3.mulScalar(minAxis, Math.sin(step))

    let translationVec = v3.copy(planetPos)
    translationVec = v3.add(translationVec, majorAxis)
    translationVec = v3.add(translationVec, minAxis)

    return translationVec
}

function standardPerpendicular(vector) {
    const vx = vector[0]
    const vy = vector[1]
    const vz = vector[2]

    let px = 1
    let py = 1
    let pz = 1

    if (vx != 0) {
        px = -(vy * py + vz * pz) / vx
        return v3.normalize(v3.create(px, py, pz))
    }

    if (vy != 0) {
        py = -(vx * px + vz * pz) / vy
        return v3.normalize(v3.create(px, py, pz))
    }

    if (vz != 0) {
        pz = -(vx * px + vy * py) / vz
        return v3.normalize(v3.create(px, py, pz))
    }

    return v3.create(0, 0, 0)
}
