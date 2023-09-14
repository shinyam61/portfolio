import {matIV, qtnIV, sphere} from '../webgl_util/minMatrixb';
import webglFunc from '../webgl_util/webglFunc';
import vertexShader from '../shader/vertexShader.glsl?raw';
import fragmentShader from '../shader/fragment.glsl?raw';
import offscrrenVertexSader from '../shader/offscrrenVertex.glsl?raw';
import offscrrenFragmentSader from '../shader/offscrrenFragment.glsl?raw';

export default () => {

  const r: {
    [key: string]: any
  } = {}

  const canvas = document.getElementById('commonBg') as HTMLCanvasElement;
  const gl = getCanvasContext(canvas);
  
  const init = () => {
    if (!gl) {
      return;
    }

    resize();
    window.addEventListener('resize', resize, false);

    canvas.width = r.w;
    canvas.height = r.h;

    const ovs = webglFunc.create_shader(gl, offscrrenVertexSader, 'v');
    const ofs = webglFunc.create_shader(gl, offscrrenFragmentSader, 'f');
    r.oProgram = webglFunc.create_program(gl, ovs, ofs);
    const oPrg = r.oProgram;

    r.offscreenAttLocation = [
      gl.getAttribLocation(oPrg, 'position'),
      gl.getAttribLocation(oPrg, 'normal'),
      gl.getAttribLocation(oPrg, 'color')
    ]
    r.offscreenAttStride = [
      3, 3, 4
    ];

    r.sphere = sphere(24, 24, 2.0, [1., 1., 1., 1.0])
    r.sphere.vbo = [
      webglFunc.create_vbo(gl, r.sphere.p),
      webglFunc.create_vbo(gl, r.sphere.n),
      webglFunc.create_vbo(gl, r.sphere.c),
    ];
    r.sphere.ibo = webglFunc.create_ibo(gl, r.sphere.i)

    r.offscreenUniLocation = {
      mvpMatrix: gl.getUniformLocation(oPrg, 'mvpMatrix'),
      mMatrix: gl.getUniformLocation(oPrg, 'mMatrix'),
      invMatrix: gl.getUniformLocation(oPrg, 'invMatrix'),
      uColor: gl.getUniformLocation(oPrg, 'uColor'),
    }
    r.offscreen = webglFunc.create_framebuffer(gl, r.w, r.h)



    const vs = webglFunc.create_shader(gl, vertexShader, 'v');
    const fs = webglFunc.create_shader(gl, fragmentShader, 'f');
    r.program = webglFunc.create_program(gl, vs, fs);
    const prg = r.program;

    r.renderAttLocation = [
      gl.getAttribLocation(prg, 'position'),
      gl.getAttribLocation(prg, 'texCoord')
    ]
    r.renderAttStride = [
      3, 2
    ];
    r.plane = {};
    r.plane.vbo = [
      webglFunc.create_vbo(gl, [
        -1.0,  1.0, 0.0, 
         1.0,  1.0, 0.0, 
        -1.0, -1.0, 0.0, 
         1.0, -1.0, 0.0
      ]),
      webglFunc.create_vbo(gl, [
        0.0, 0.0, 
        1.0, 0.0,
        0.0, 1.0,
        1.0, 1.0
      ]),
    ];
    r.plane.index = [
      0, 2, 1,
      1, 2, 3
    ];
    r.plane.ibo = webglFunc.create_ibo(gl, r.plane.index)
    r.renderUniLocation = {
      texture: gl.getUniformLocation(prg, 'texture'),
      uResolution: gl.getUniformLocation(prg, 'uResolution'),
      weight: gl.getUniformLocation(prg, 'weight'),
    };

    // gaussianフィルタの重み係数を算出
    const distance = Math.pow(10000, 2) / 100;
    r.weight = [...Array(10)].map((_, idx) => {
      const r = 1.0 + 2.0 * idx;
      return Math.exp(-0.5 * (r * r) / distance);
    });
    const total = r.weight.map((w: number, i: number) => {
      return i == 0 ? w : w * 2;
    }).reduce((a: number, c: number) => {
      return (a + c)
    }, 0);
    r.weight = r.weight.map((v: number) => v / total);
    console.log(r.weight)

    // matIV オブジェクトを使った行列の初期化
    // matIVオブジェクトを生成
    var m = new matIV();
    r.m = m;

    r.mMatrix = m.identity(m.create());
    r.vMatrix = m.identity(m.create());
    r.pMatrix = m.identity(m.create());
    r.tmpMatrix = m.identity(m.create()); // m(Model), p(Projection) の合成行列を格納するための変数
    r.mvpMatrix = m.identity(m.create());
    r.invMatrix = m.identity(m.create());



    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);
    r.startTime = Date.now();

    render();
  }

  const render = () => {
    if (!gl) {
      return;
    }

    const nowTime = (Date.now() - r.startTime) * 0.0005;

    {
      // 視点ベクトル
      var eyeDirection = [0.0, 0.0, 10.0];

      // ビュー×プロジェクション座標変換行列
      r.m.lookAt(eyeDirection, [0, 0, 0], [0, 1, 0], r.vMatrix);
      r.m.perspective(45, r.w / r.h, 0.1, 500, r.pMatrix);
      r.m.multiply(r.pMatrix, r.vMatrix, r.tmpMatrix);

      gl.bindFramebuffer(gl.FRAMEBUFFER, r.offscreen.framebuffer);

      gl.viewport(0, 0, r.w, r.h);
      gl.clearColor(.0, .0, .0, 1.0);
      gl.clearDepth(1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
      gl.useProgram(r.oProgram);
  
      {
        webglFunc.set_attribute(gl, r.sphere.vbo, r.offscreenAttLocation, r.offscreenAttStride);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, r.sphere.ibo);
  
          // モデル座標変換行列の生成
        r.m.identity(r.mMatrix);
        r.m.rotate(r.mMatrix, -(23 % 360) * Math.PI / 180, [0, 0, 1], r.mMatrix);
        r.m.rotate(r.mMatrix, nowTime, [0, 1, 0], r.mMatrix);
        r.m.multiply(r.tmpMatrix, r.mMatrix, r.mvpMatrix);
        r.m.inverse(r.mMatrix, r.invMatrix);
  
        gl.uniformMatrix4fv(r.offscreenUniLocation.mvpMatrix, false, r.mvpMatrix);
        gl.uniformMatrix4fv(r.offscreenUniLocation.mMatrix, false, r.mMatrix);
        gl.uniform4fv(r.offscreenUniLocation.uColor, [1.0, 1.0, 1.0, 1.0]);
  
        gl.drawElements(gl.LINES, r.sphere.i.length, gl.UNSIGNED_SHORT, 0);
      }
  
      {
        webglFunc.set_attribute(gl, r.sphere.vbo, r.offscreenAttLocation, r.offscreenAttStride);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, r.sphere.ibo);
  
          // モデル座標変換行列の生成
        r.m.identity(r.mMatrix);
        r.m.scale(r.mMatrix, [.25, .25, .25], r.mMatrix);
        r.m.rotate(r.mMatrix, -(23 % 360) * Math.PI / 180, [0, 0, 1], r.mMatrix);
        r.m.rotate(r.mMatrix, nowTime, [0, 1, 0], r.mMatrix);
        r.m.translate(r.mMatrix, [20., 0., 0.], r.mMatrix);
        r.m.rotate(r.mMatrix, nowTime, [0, 1, 0], r.mMatrix);
        r.m.multiply(r.tmpMatrix, r.mMatrix, r.mvpMatrix);
        r.m.inverse(r.mMatrix, r.invMatrix);
  
        gl.uniformMatrix4fv(r.offscreenUniLocation.mvpMatrix, false, r.mvpMatrix);
        gl.uniformMatrix4fv(r.offscreenUniLocation.mMatrix, false, r.mMatrix);
        gl.uniform4fv(r.offscreenUniLocation.uColor, [1.0, .0, .0, .75]);
  
        gl.drawElements(gl.LINES, r.sphere.i.length, gl.UNSIGNED_SHORT, 0);
      }
  
      {
        webglFunc.set_attribute(gl, r.sphere.vbo, r.offscreenAttLocation, r.offscreenAttStride);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, r.sphere.ibo);
  
          // モデル座標変換行列の生成
        r.m.identity(r.mMatrix);
        r.m.scale(r.mMatrix, [.1, .1, .1], r.mMatrix);
        r.m.rotate(r.mMatrix, (23 % 360) * Math.PI / 180, [0, 0, 1], r.mMatrix);
        r.m.rotate(r.mMatrix, -nowTime, [0, 1, 0], r.mMatrix);
        r.m.translate(r.mMatrix, [35., 0., 0.], r.mMatrix);
        r.m.rotate(r.mMatrix, nowTime, [0, 1, 0], r.mMatrix);
        r.m.multiply(r.tmpMatrix, r.mMatrix, r.mvpMatrix);
        r.m.inverse(r.mMatrix, r.invMatrix);
  
        gl.uniformMatrix4fv(r.offscreenUniLocation.mvpMatrix, false, r.mvpMatrix);
        gl.uniformMatrix4fv(r.offscreenUniLocation.mMatrix, false, r.mMatrix);
        gl.uniform4fv(r.offscreenUniLocation.uColor, [1.0, .5, .0, .75]);
  
        gl.drawElements(gl.LINES, r.sphere.i.length, gl.UNSIGNED_SHORT, 0);
      }
  
      {
        webglFunc.set_attribute(gl, r.sphere.vbo, r.offscreenAttLocation, r.offscreenAttStride);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, r.sphere.ibo);
  
          // モデル座標変換行列の生成
        r.m.identity(r.mMatrix);
        r.m.scale(r.mMatrix, [1.25, 1.25, 1.25], r.mMatrix);
        r.m.rotate(r.mMatrix, -(23 % 360) * Math.PI / 180, [0, 0, 1], r.mMatrix);
        r.m.rotate(r.mMatrix, nowTime * 2, [1, 0, 0], r.mMatrix);
        r.m.translate(r.mMatrix, [0., 20., 0.], r.mMatrix);
        r.m.rotate(r.mMatrix, -nowTime * .01, [1, 0, 0], r.mMatrix);
        r.m.multiply(r.tmpMatrix, r.mMatrix, r.mvpMatrix);
        r.m.inverse(r.mMatrix, r.invMatrix);
  
        gl.uniformMatrix4fv(r.offscreenUniLocation.mvpMatrix, false, r.mvpMatrix);
        gl.uniformMatrix4fv(r.offscreenUniLocation.mMatrix, false, r.mMatrix);
        gl.uniform4fv(r.offscreenUniLocation.uColor, [.5, .0, .5, .75]);
  
        gl.drawElements(gl.LINES, r.sphere.i.length, gl.UNSIGNED_SHORT, 0);
      }
    }

    {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      
      gl.clearColor(1.0, 1.0, 1.0, 1.0);
      gl.clearDepth(1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
      gl.useProgram(r.program);
  
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, r.offscreen.texture);
      {
    
        webglFunc.set_attribute(gl, r.plane.vbo, r.renderAttLocation, r.renderAttStride);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, r.plane.ibo);
  
        gl.uniform1i(r.renderUniLocation.texture, 0);
        gl.uniform2fv(r.renderUniLocation.uResolution, [r.w, r.h]);
        gl.uniform1fv(r.renderUniLocation.weight, r.weight);
  
        gl.drawElements(gl.TRIANGLES, r.plane.index.length, gl.UNSIGNED_SHORT, 0);
      }
    }


    requestAnimationFrame(render);
  }

  const resize = () => {
    r.w = window.innerWidth;
    r.h = window.innerHeight;

    canvas.width = r.w;
    canvas.height = r.h;

    if (r.offscreen) {
      webglFunc.delete_framebuffer(gl, r.offscreen.framebuffer, r.offscreen.depthRenderbuffer, r.offscreen.texture);
      r.offscreen = webglFunc.create_framebuffer(gl, r.w, r.h)
    }
  }

  init();
}

const getCanvasContext = (canvas: HTMLCanvasElement) => {
  return canvas.getContext('webgl');
}