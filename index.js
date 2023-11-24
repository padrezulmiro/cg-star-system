import * as twgl from "./node_modules/twgl.js/dist/5.x/twgl-full.module.js"
import config from "./star-config.json" assert {type: "json"}
import {
    vsDirect,
    fsDirect
} from "./shaders.js"

const m4 = twgl.m4
const primitives = twgl.primitives

function main() {
    const programInfo = twgl.createProgramInfo(gl, [vsDirect, fsDirect])

}

function initGL(gl) {}

function render(step) {}
