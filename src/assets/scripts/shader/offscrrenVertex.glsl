precision mediump float;

attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;

uniform mat4 mMatrix;
uniform mat4 mvpMatrix;
uniform mat4 invMatrix;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vColor;


void main () {
  vPosition = (mMatrix * vec4(position, 1.0)).xyz;
  vNormal = normal;
  vColor = color;

  gl_Position = mvpMatrix * vec4(position, 1.0);
}