// uniform float u_time;
uniform float u_size;
uniform vec3 u_color;
uniform float progress1;
uniform float progress2;
attribute float size;
// attribute vec3 customColor;
attribute float textureIndex;
// varying vec3 vColor;
varying float vTextureIndex;



void main(){

    vTextureIndex = textureIndex;
    // vColor = customColor;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
    
    gl_PointSize = size * (1. / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}