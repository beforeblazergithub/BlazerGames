window.onload = init
function init() {
  let renderer, canvas
  const dpr = Math.max(1, devicePixelRatio)
  const resize = () => {
    const { innerWidth: width, innerHeight: height } = window
    canvas.width = width * dpr
    canvas.height = height * dpr
    if (renderer) {
      renderer.updateScale(dpr)
    }
  }
  const source = document.querySelector("script[type='x-shader/x-fragment']").textContent
  canvas = document.createElement("canvas")
  document.body.appendChild(canvas)
  document.body.style = "margin:0;touch-action:none;overflow:hidden"
  canvas.style.width = "100%"
  canvas.style.height = "auto"
  canvas.style.userSelect = "none"
  canvas.style.position = 'absolute'
  canvas.style.zIndex = '1'
  renderer = new Renderer(canvas, dpr)
  renderer.setup()
  renderer.init()
  resize()
  if (renderer.test(source) === null) {
    renderer.updateShader(source)
  }
  window.onresize = resize
  const loop = (now) => {
    renderer.render(now)
    requestAnimationFrame(loop)
  }
  loop(0)
}
class Renderer {
  #vertexSrc = "#version 300 es\nprecision highp float;\nin vec4 position;\nvoid main(){gl_Position=position;}"
  #fragmtSrc = "#version 300 es\nprecision highp float;\nout vec4 O;\nuniform float time;\nuniform vec2 resolution;\nvoid main() {\n\tvec2 uv=gl_FragCoord.xy/resolution;\n\tO=vec4(uv,sin(time)*.5+.5,1);\n}"
  #vertices = [-1, 1, -1, -1, 1, 1, 1, -1]
  constructor(canvas, scale) {
    this.canvas = canvas
    this.scale = scale
    this.gl = canvas.getContext("webgl2")
    this.gl.viewport(0, 0, canvas.width * scale, canvas.height * scale)
    this.shaderSource = this.#fragmtSrc
    this.mouseCoords = [0, 0]
    this.pointerCoords = [0, 0]
    this.nbrOfPointers = 0
  }
  get defaultSource() { return this.#fragmtSrc }
  updateShader(source) {
    this.reset()
    this.shaderSource = source
    this.setup()
    this.init()
  }
  updateMouse(coords) {
    this.mouseCoords = coords
  }
  updatePointerCoords(coords) {
    this.pointerCoords = coords
  }
  updatePointerCount(nbr) {
    this.nbrOfPointers = nbr
  }
  updateScale(scale) {
    this.scale = scale
    this.gl.viewport(0, 0, this.canvas.width * scale, this.canvas.height * scale)
  }
  compile(shader, source) {
    const gl = this.gl
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader))
      this.canvas.dispatchEvent(new CustomEvent('shader-error', { detail: gl.getShaderInfoLog(shader) }))
    }
  }
  test(source) {
    let result = null
    const gl = this.gl
    const shader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      result = gl.getShaderInfoLog(shader)
    }
    if (gl.getShaderParameter(shader, gl.DELETE_STATUS)) {
      gl.deleteShader(shader)
    }
    return result
  }
  reset() {
    const { gl, program, vs, fs } = this
    if (!program || gl.getProgramParameter(program, gl.DELETE_STATUS)) return
    if (gl.getShaderParameter(vs, gl.DELETE_STATUS)) {
      gl.detachShader(program, vs)
      gl.deleteShader(vs)
    }
    if (gl.getShaderParameter(fs, gl.DELETE_STATUS)) {
      gl.detachShader(program, fs)
      gl.deleteShader(fs)
    }
    gl.deleteProgram(program)
  }
  setup() {
    const gl = this.gl
    this.vs = gl.createShader(gl.VERTEX_SHADER)
    this.fs = gl.createShader(gl.FRAGMENT_SHADER)
    this.compile(this.vs, this.#vertexSrc)
    this.compile(this.fs, this.shaderSource)
    this.program = gl.createProgram()
    gl.attachShader(this.program, this.vs)
    gl.attachShader(this.program, this.fs)
    gl.linkProgram(this.program)
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(this.program))
    }
  }
  init() {
    const { gl, program } = this
    this.buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.#vertices), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, "position")
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    program.resolution = gl.getUniformLocation(program, "resolution")
    program.time = gl.getUniformLocation(program, "time")
    program.touch = gl.getUniformLocation(program, "touch")
    program.pointerCount = gl.getUniformLocation(program, "pointerCount")
    program.pointers = gl.getUniformLocation(program, "pointers")
  }
  render(now = 0) {
    const { gl, program, buffer, canvas, mouseCoords, pointerCoords, nbrOfPointers } = this
    
    if (!program || gl.getProgramParameter(program, gl.DELETE_STATUS)) return
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.uniform2f(program.resolution, canvas.width, canvas.height)
    gl.uniform1f(program.time, now * 1e-3)
    gl.uniform2f(program.touch, ...mouseCoords)
    gl.uniform1i(program.pointerCount, nbrOfPointers)
    gl.uniform2fv(program.pointers, pointerCoords)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }
}