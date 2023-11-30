export const vsDirect = `
uniform mat4 u_matrix;

attribute vec4 position;

varying vec4 vcolor;

void main()
{
    gl_Position = u_matrix * position;
    vcolor = position;
}
`

export const fsDirect = `
precision mediump float;
varying vec4 vcolor;

void main() {
    //gl_FragColor = vec4(1, 1, 0, 1);
    gl_FragColor = vcolor;
}
`
