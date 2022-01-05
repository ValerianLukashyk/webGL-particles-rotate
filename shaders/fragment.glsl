#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D textures[11];
// uniform vec3 u_color;
uniform float progress;
uniform float progress_two;
uniform float progress_three;
uniform float progress_four;
uniform float progress_five;
uniform float progress_six;
uniform float progress_seven;
uniform float progress_eight;
uniform float progress_nine;
uniform float progress_ten;
// varying vec3 vColor;
varying float vTextureIndex;


void main(){
    int texIdx = int(vTextureIndex + 0.5);
    // vec3 color = u_color;
    vec4 texture_point = texture2D( textures[0], gl_PointCoord );
    vec4 texture_1 = texture2D( textures[1], gl_PointCoord );
    vec4 texture_2 = texture2D( textures[2], gl_PointCoord );
    vec4 texture_3 = texture2D( textures[3], gl_PointCoord );
    vec4 texture_4 = texture2D( textures[4], gl_PointCoord );
    vec4 texture_5 = texture2D( textures[5], gl_PointCoord );
    vec4 texture_6 = texture2D( textures[6], gl_PointCoord );
    vec4 texture_7 = texture2D( textures[7], gl_PointCoord );
    vec4 texture_8 = texture2D( textures[8], gl_PointCoord );
    vec4 texture_9 = texture2D( textures[9], gl_PointCoord );
    vec4 texture_10 = texture2D( textures[10], gl_PointCoord );

    
    gl_FragColor=vec4(vec3(1.0), 1.0);

    if (texIdx == 4671) {
        gl_FragColor *= mix(texture_point, texture_2, progress);
    } else if (texIdx == 4634) {
        gl_FragColor *= mix(texture_point, texture_1, progress_two);
    } else if (texIdx == 4741) {
        gl_FragColor *= mix(texture_point, texture_3, progress_three);
    } else if (texIdx == 1596) {
        gl_FragColor *= mix(texture_point, texture_4, progress_four);
    } else if (texIdx == 3279) {
        gl_FragColor *= mix(texture_point, texture_5, progress_five);
    } else if (texIdx == 1572) {
        gl_FragColor *= mix(texture_point, texture_6, progress_six);
    } else if (texIdx == 2683) {
        gl_FragColor *= mix(texture_point, texture_7, progress_seven);
    } else if (texIdx == 4899) {
        gl_FragColor *= mix(texture_point, texture_8, progress_eight);
    } else if (texIdx == 2707) {
        gl_FragColor *= mix(texture_point, texture_9, progress_nine);
    } else if (texIdx == 3454) {
        gl_FragColor *= mix(texture_point, texture_10, progress_ten);
    } else {
    gl_FragColor *= texture_point;
    }
}   