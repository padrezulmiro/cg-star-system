export const vsDirect = `
uniform mat4 u_worldViewProjection;
attribute vec4 position;
attribute vec2 texcoord;
varying vec2 v_texcoord;

void main()
{
    //********** texturing **********
    gl_Position = u_worldViewProjection * position;
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
}
`

export const vsPhong = `
uniform mat4 u_worldViewProjection;          // projection matrix
uniform mat4 u_modelview;       // movement matrix from obj to camera view?
uniform mat4 u_worldInverseTranspose;       //
attribute vec4 position;
attribute vec3 normal;

attribute vec2 texcoord;
varying vec2 v_texcoord;

varying vec3 normalInterp;
varying vec3 vertPos;

void main()
{
    //********** texturing **********
    gl_Position = u_worldViewProjection * position;
    v_texcoord = texcoord;
    // ********** shading **********
    vec4 vertPos4 = u_modelview * position; //vec4(position, 1.0);
    vertPos = vec3(vertPos4) / vertPos4.w;
    normalInterp = (u_worldInverseTranspose * vec4(normal, 0)).xyz; //vec3(u_normalMat * vec4(normal, 0.0));

    // gl_Position = u_worldViewProjection * vertPos4; //projection * vertPos4;
}

`

export const fsPhong = `
precision mediump float;

varying vec2 v_texcoord;
uniform sampler2D u_texture;

varying vec3 normalInterp;  // Surface normal
varying vec3 vertPos;       // Vertex position
uniform float Ka;   // Ambient reflection coefficient
uniform float Kd;   // Diffuse reflection coefficient
uniform float Ks;   // Specular reflection coefficient
uniform float shininessVal; // Shininess
// Material color
uniform vec4 ambientColor;
// uniform vec4 diffuseColor;
uniform vec4 specularColor;
uniform vec3 lightPos; // Light position


void main() {
    // gl_FragColor = texture2D(u_texture, v_texcoord);
    // gl_FragColor = vec4(0,0,0,1);

    vec3 N = normalize(normalInterp);
    vec3 L = normalize(lightPos - vertPos);
  
    // Lambert's cosine law
    float lambertian = max(dot(N, L), 0.0);
    float specular = 0.0;
    if(lambertian > 0.0) {
      vec3 R = reflect(-L, N);      // Reflected light vector
      vec3 V = normalize(-vertPos); // Vector to viewer
      // Compute the specular term
      float specAngle = max(dot(R, V), 0.0);
      specular = pow(specAngle, shininessVal);
    }
    vec4 diffuseColor = texture2D(u_texture, v_texcoord);
    gl_FragColor = Ka * ambientColor + Kd * lambertian * diffuseColor + Ks * specular * specularColor, 1.0;
    // gl_FragColor = Kd * lambertian * diffuseColor;// Ka * ambientColor;
}
`

export const vsGouraud = `
uniform mat4 u_worldViewProjection;
// attribute vec4 position;

attribute vec2 texcoord;
varying vec2 v_texcoord;

attribute vec3 position; //this is just position;
attribute vec3 normal;      // normal of a vertex
// uniform mat4 projection, //this is just u_worldViewProjection
uniform mat4 modelview;     //
uniform mat4 normalMat;     //
varying vec3 normalInterp;  // 
varying vec3 vertPos;       //

uniform float Ka;   // Ambient reflection coefficient
uniform float Kd;   // Diffuse reflection coefficient
uniform float Ks;   // Specular reflection coefficient
uniform float shininessVal; // Shininess
// Material color
const vec3 ambientColor = vec3(1.,1.,1.);
const vec3 diffuseColor = vec3(1.,2.,4.);
const vec3 specularColor = vec3(1.,1.,1.);
const vec3 lightPos = vec3(0.,0.,1.);  // Light position
varying vec4 color;     //color


void main()
{
    // ********** texturing **********
    gl_Position = u_worldViewProjection * position;
    v_texcoord = texcoord;

    // ********** shading **********
    vec4 vertPos4 = modelview * position //vec4(position, 1.0);        // 
    vertPos = vec3(vertPos4) / vertPos4.w;                  // 
    normalInterp = vec3(normalMat * vec4(normal, 0.0));     // 
    gl_Position = projection * vertPos4;                    // 
  
    vec3 N = normalize(normalInterp);
    vec3 L = normalize(lightPos - vertPos);

    // Lambert's cosine law
    float lambertian = max(dot(N, L), 0.0);
    float specular = 0.0;
    if(lambertian > 0.0) {
      vec3 R = reflect(-L, N);      // Reflected light vector
      vec3 V = normalize(-vertPos); // Vector to viewer
      // Compute the specular term
      float specAngle = max(dot(R, V), 0.0);
      specular = pow(specAngle, shininessVal);
    }

    // gl_FragColor = vec4(Ka * ambientColor +
    //              Kd * lambertian * diffuseColor +
    //              Ks * specular * specularColor, 1.0);
    gl_FragColor = vec4(Ka * ambientColor, 1.0);
}
`

export const fsGouraud = `
precision mediump float;

varying vec2 v_texcoord;
uniform sampler2D u_texture;

void main() {
    // gl_FragColor = texture2D(u_texture, v_texcoord);
    //gl_FragColor = vec4(1,0,0,1);
    gl_FragColor = vec4(v_texcoord[0],v_texcoord[1],0,1);  // -------CHANGED-------------------------
}
`

