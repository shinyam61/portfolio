precision highp float;

uniform sampler2D texture;
uniform vec2 uResolution;
uniform float weight[10];

varying vec2 vTexCoord;

void main () {
  vec2 fSize = 1.0 / uResolution; // フラグメントあたりの大きさ
  vec2 fc = gl_FragCoord.st;     // ピクセルサイズの座標

  vec3  destColor = vec3(0.0);
  destColor += texture2D(texture, (fc + vec2(-9.0, 0.0)) * fSize).rgb * weight[9];
  destColor += texture2D(texture, (fc + vec2(-8.0, 0.0)) * fSize).rgb * weight[8];
  destColor += texture2D(texture, (fc + vec2(-7.0, 0.0)) * fSize).rgb * weight[7];
  destColor += texture2D(texture, (fc + vec2(-6.0, 0.0)) * fSize).rgb * weight[6];
  destColor += texture2D(texture, (fc + vec2(-5.0, 0.0)) * fSize).rgb * weight[5];
  destColor += texture2D(texture, (fc + vec2(-4.0, 0.0)) * fSize).rgb * weight[4];
  destColor += texture2D(texture, (fc + vec2(-3.0, 0.0)) * fSize).rgb * weight[3];
  destColor += texture2D(texture, (fc + vec2(-2.0, 0.0)) * fSize).rgb * weight[2];
  destColor += texture2D(texture, (fc + vec2(-1.0, 0.0)) * fSize).rgb * weight[1];
  destColor += texture2D(texture, (fc + vec2( 0.0, 0.0)) * fSize).rgb * weight[0];
  destColor += texture2D(texture, (fc + vec2( 1.0, 0.0)) * fSize).rgb * weight[1];
  destColor += texture2D(texture, (fc + vec2( 2.0, 0.0)) * fSize).rgb * weight[2];
  destColor += texture2D(texture, (fc + vec2( 3.0, 0.0)) * fSize).rgb * weight[3];
  destColor += texture2D(texture, (fc + vec2( 4.0, 0.0)) * fSize).rgb * weight[4];
  destColor += texture2D(texture, (fc + vec2( 5.0, 0.0)) * fSize).rgb * weight[5];
  destColor += texture2D(texture, (fc + vec2( 6.0, 0.0)) * fSize).rgb * weight[6];
  destColor += texture2D(texture, (fc + vec2( 7.0, 0.0)) * fSize).rgb * weight[7];
  destColor += texture2D(texture, (fc + vec2( 8.0, 0.0)) * fSize).rgb * weight[8];
  destColor += texture2D(texture, (fc + vec2( 9.0, 0.0)) * fSize).rgb * weight[9];

  // 
  // color = vec4(vec3(dot(color.rgb, vec3(.15))), 1.0);
  gl_FragColor = vec4(destColor, 1.0);
}