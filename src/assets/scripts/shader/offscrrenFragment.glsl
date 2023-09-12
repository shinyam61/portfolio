precision mediump float;

uniform vec4 uColor;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vColor;

void main () {

  gl_FragColor = uColor;
  // gl_FragColor = vec4(1.0, .0, .0, 1.0);
}