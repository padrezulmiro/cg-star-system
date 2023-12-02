export const vsDirect = `
uniform mat4 u_matrix;

attribute vec4 position;

attribute vec2 texCoord;
varying vec2 v_texCoord;

void main()
{
    gl_Position = u_matrix * position;
    v_texCoord = texCoord;
}
`

export const fsDirect = `
precision mediump float;

varying vec2 v_texCoord;
uniform sampler2D u_texture;

void main() {
    gl_FragColor = texture2D(u_texture, v_texCoord);
}
`
