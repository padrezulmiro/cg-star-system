export const vsDirect = `
uniform mat4 u_tMatrix;
attribute vec4 a_position;

void main() {
    gl_Position = u_tMatrix * a_position;
}
`

export const fsDirect = `
precision mediump float;
uniform vec4 a_color;

void main() {
    gl_FragColor = a_color;
}
`
