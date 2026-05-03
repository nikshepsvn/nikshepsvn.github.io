// GPU hero visual: cool, technical.
// A slowly-shifting grid of topographic contour lines in near-white on near-black,
// with a faint moving vignette. No warmth — just pure mono data-viz energy.

(function () {
  const canvas = document.getElementById("gpu");
  if (!canvas) return;

  const gl = canvas.getContext("webgl", { antialias: true, alpha: false });
  if (!gl) { canvas.style.display = "none"; return; }

  const vert = /* glsl */ `
    attribute vec2 a_pos;
    void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
  `;

  const frag = /* glsl */ `
    precision highp float;
    uniform float u_time;
    uniform vec2  u_res;
    uniform vec2  u_mouse;

    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }
    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.55;
      mat2 rot = mat2(0.82, -0.57, 0.57, 0.82);
      for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p = rot * p * 2.02;
        a *= 0.55;
      }
      return v;
    }

    void main() {
      vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.x, u_res.y);
      vec2 m = (u_mouse - 0.5 * u_res) / min(u_res.x, u_res.y);
      p += m * 0.05;

      float t = u_time * 0.04;
      float n = fbm(p * 1.9 + vec2(t, -t * 0.6));
      n = fbm(p * 1.9 + vec2(n * 1.1, t * 0.9));

      // Contour lines (topographic)
      float bands = 12.0;
      float v = abs(fract(n * bands) - 0.5);
      float aa = fwidth(n * bands) * 1.4;
      float line = 1.0 - smoothstep(aa, aa + 0.06, v);

      // Major lines every 5th contour (brighter, thinner)
      float majorV = abs(fract(n * bands / 5.0) - 0.5);
      float majorAA = fwidth(n * bands / 5.0) * 1.6;
      float majorLine = 1.0 - smoothstep(majorAA, majorAA + 0.04, majorV);

      // Base — pure white
      vec3 bg = vec3(1.0);

      // Contour color — near-black
      vec3 contour = vec3(0.04);

      float intensity = line * 0.06 + majorLine * 0.16;

      // Soft radial attenuation so lines are even subtler at edges
      float edge = smoothstep(1.4, 0.2, length(p));
      intensity *= mix(0.25, 1.0, edge);

      vec3 col = bg - contour * intensity;

      // Mouse-tracking subtle darkening — a soft ink halo
      float halo = exp(-pow(length(p - m * 0.8) * 1.6, 2.0));
      col -= vec3(0.04) * halo * 0.5;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error("shader:", gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  gl.getExtension("OES_standard_derivatives");

  const vs = compile(gl.VERTEX_SHADER, vert);
  const fs = compile(
    gl.FRAGMENT_SHADER,
    "#extension GL_OES_standard_derivatives : enable\n" + frag
  );
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("link:", gl.getProgramInfoLog(prog));
    return;
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW
  );
  const loc = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uTime  = gl.getUniformLocation(prog, "u_time");
  const uRes   = gl.getUniformLocation(prog, "u_res");
  const uMouse = gl.getUniformLocation(prog, "u_mouse");

  let mx = 0, my = 0, tx = 0, ty = 0;
  window.addEventListener(
    "pointermove",
    (e) => {
      const r = canvas.getBoundingClientRect();
      tx = (e.clientX - r.left);
      ty = (r.height - (e.clientY - r.top));
    },
    { passive: true }
  );

  function size() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth  * dpr;
    const h = canvas.clientHeight * dpr;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  const t0 = performance.now();
  function frame(now) {
    size();
    mx += (tx - mx) * 0.055;
    my += (ty - my) * 0.055;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    gl.uniform1f(uTime, (now - t0) / 1000);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform2f(uMouse, mx * dpr, my * dpr);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
