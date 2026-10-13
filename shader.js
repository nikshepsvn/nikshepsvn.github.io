// Page atmosphere: a soft, slowly drifting mist in the page's own colors.
// Rendered at low resolution (it is all blur) and only while visible; a static
// frame for reduced motion, and the plain ground color when WebGL is missing.

(function () {
  const canvas = document.getElementById("mist");
  if (!canvas) return;
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false, preserveDrawingBuffer: false });
  if (!gl) { canvas.remove(); return; }

  const vert = `
    attribute vec2 a_pos;
    void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
  `;

  // Two warped noise fields mix ground, a tint and a deeper tint; contrast stays tiny.
  const frag = `
    precision mediump float;
    uniform float u_time;
    uniform vec2  u_res;
    uniform vec3  u_ground;
    uniform vec3  u_tint;
    uniform vec3  u_deep;
    uniform float u_strength;

    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }
    float fbm(vec2 p) {
      float v = 0.0, a = 0.5;
      mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
      for (int i = 0; i < 3; i++) { v += a * noise(p); p = r * p * 2.0; a *= 0.5; }
      return v;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_res;
      vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / max(u_res.x, u_res.y) * 1.3;
      float t = u_time * 0.018;
      vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, -t)));
      float n = fbm(p + 1.6 * q + vec2(t * 0.6, t * 0.3));
      float m = fbm(p * 0.7 - q + vec2(-t * 0.4, 2.0));

      // Mist gathers toward the top of the screen and thins toward the bottom.
      float lift = mix(0.55, 1.0, smoothstep(0.0, 1.0, uv.y));
      vec3 col = u_ground;
      col = mix(col, u_tint, smoothstep(0.2, 0.95, n) * u_strength * lift);
      col = mix(col, u_deep, smoothstep(0.25, 1.0, m) * u_strength * 0.6 * lift);
      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const prog = gl.createProgram();
  const vs = compile(gl.VERTEX_SHADER, vert);
  const fs = compile(gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) { canvas.remove(); return; }
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.remove(); return; }
  gl.useProgram(prog);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = (name) => gl.getUniformLocation(prog, name);
  const uTime = u("u_time"), uRes = u("u_res"), uGround = u("u_ground"), uTint = u("u_tint"), uDeep = u("u_deep"), uStrength = u("u_strength");

  // Colors come from the CSS tokens, so light and dark themes stay in sync.
  const rgb = (name) => {
    const probe = document.createElement("i");
    probe.style.color = `var(${name})`;
    document.body.appendChild(probe);
    const [r, g, b] = getComputedStyle(probe).color.match(/\d+(\.\d+)?/g).map(Number);
    probe.remove();
    return [r / 255, g / 255, b / 255];
  };
  const readColors = () => {
    const css = getComputedStyle(document.documentElement);
    gl.uniform3fv(uGround, rgb("--ground"));
    gl.uniform3fv(uTint, rgb("--mist-1"));
    gl.uniform3fv(uDeep, rgb("--mist-2"));
    gl.uniform1f(uStrength, parseFloat(css.getPropertyValue("--mist-strength")) || 1);
  };

  // A quarter of the CSS pixels is plenty for a field this soft.
  const SCALE = 0.25;
  const size = () => {
    const w = Math.max(1, Math.round(canvas.clientWidth * SCALE));
    const h = Math.max(1, Math.round(canvas.clientHeight * SCALE));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uRes, w, h);
  };

  const still = matchMedia("(prefers-reduced-motion: reduce)");
  const t0 = performance.now();
  let raf = 0, last = 0;
  const draw = (now) => {
    gl.uniform1f(uTime, still.matches ? 40 : (now - t0) / 1000 + 40);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };
  // About 20fps is smooth for motion this slow and keeps the GPU mostly idle.
  const loop = (now) => {
    raf = requestAnimationFrame(loop);
    if (now - last < 50) return;
    last = now;
    draw(now);
  };
  const start = () => { if (!raf && !still.matches && !document.hidden) raf = requestAnimationFrame(loop); };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  const refresh = () => { size(); readColors(); draw(performance.now()); };

  refresh();
  canvas.classList.add("is-ready");
  start();
  window.addEventListener("resize", refresh);
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", refresh);
  still.addEventListener("change", () => { stop(); refresh(); start(); });
})();
