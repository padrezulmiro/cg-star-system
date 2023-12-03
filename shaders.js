export const vsDirect = `
uniform mat4 u_matrix;

attribute vec4 position;

attribute vec2 texcoord;
varying vec2 v_texcoord;

void main()
{
    gl_Position = u_matrix * position;
    v_texcoord = texcoord;
}
`

export const fsDirect = `
precision mediump float;

varying vec2 v_texcoord;
uniform sampler2D u_texture;

void main() {
    gl_FragColor = texture2D(u_texture, v_texcoord);
    //gl_FragColor = vec4(1,0,0,1);
    // gl_FragColor = vec4(v_texcoord[0],v_texcoord[1],0,1);  // -------CHANGED-------------------------
}
`
