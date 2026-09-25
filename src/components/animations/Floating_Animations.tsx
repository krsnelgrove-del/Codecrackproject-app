"use client";

import { useEffect, useRef, memo } from "react"
import { Renderer, Program, Mesh, Triangle } from "ogl"

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ), 
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                            \
  for (int i = 0; i < 2; i++) {                               \
     ColorStop currentColor = colors[i];                    \
     bool isInBetween = currentColor.position <= factor;    \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  }                                                         \
  ColorStop currentColor = colors[index];                   \
  ColorStop nextColor = colors[index + 1];                  \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);
  
  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);
  
  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;
  
  float midPoint = 0.20;
  float animationAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  
  vec3 finalColor = rampColor;
  
  fragColor = vec4(finalColor * animationAlpha, animationAlpha);
}
`

interface FloatingAnimationProps {
    colorStops?: string[]
    amplitude?: number
    blend?: number
    speed?: number
    height?: string
}

function parseColor(
    color: any,
    defaultColor: [number, number, number] = [1, 0, 0]
): [number, number, number] {
    if (color === undefined || color === null || color === "") {
        return defaultColor
    }

    if (typeof color === "object") {
        if ("r" in color && "g" in color && "b" in color) {
            return [
                (color.r || 0) / 255,
                (color.g || 0) / 255,
                (color.b || 0) / 255,
            ]
        }

        if ("r" in color && color.r <= 1 && color.g <= 1 && color.b <= 1) {
            return [color.r || 0, color.g || 0, color.b || 0]
        }

        const values = Object.values(color).filter((v) => typeof v === "number") as number[]
        if (values.length >= 3) {
            const maxVal = Math.max(...values)
            if (maxVal > 1) {
                return [values[0] / 255, values[1] / 255, values[2] / 255]
            }
            return [values[0], values[1], values[2]]
        }

        return defaultColor
    }

    if (typeof color === "string") {
        const cleanColor = color.trim()

        if (cleanColor.startsWith("#")) {
            const hex =
                cleanColor.length === 4
                    ? "#" +
                      cleanColor[1] +
                      cleanColor[1] +
                      cleanColor[2] +
                      cleanColor[2] +
                      cleanColor[3] +
                      cleanColor[3]
                    : cleanColor

            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
            if (result) {
                return [
                    parseInt(result[1], 16) / 255,
                    parseInt(result[2], 16) / 255,
                    parseInt(result[3], 16) / 255,
                ]
            }
        }

        const rgbMatch = cleanColor.match(
            /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i
        )
        if (rgbMatch) {
            return [
                parseInt(rgbMatch[1]) / 255,
                parseInt(rgbMatch[2]) / 255,
                parseInt(rgbMatch[3]) / 255,
            ]
        }
    }

    return defaultColor
}

// 1. Defined standard function here without "export default"
function FloatingAnimation(props: FloatingAnimationProps) {

    const {
        colorStops = ["#a81cff", "#1cc6ff", "#2451b3"],
        amplitude = 1.0,
        blend = 0.5,
        speed = 1.0,
        height = "100%",
    } = props

    const propsRef = useRef<FloatingAnimationProps>(props)
    propsRef.current = props

    const ctnDom = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const ctn = ctnDom.current
        if (!ctn) return

        const renderer = new Renderer({
            alpha: true,
            premultipliedAlpha: true,
            antialias: true,
        })
        const gl = renderer.gl
        gl.clearColor(0, 0, 0, 0)
        gl.enable(gl.BLEND)
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

        gl.canvas.style.width = "100%"
        gl.canvas.style.height = "100%"
        gl.canvas.style.display = "block"
        gl.canvas.style.backgroundColor = "transparent"

        let program: Program
        let mesh: Mesh

        const geometry = new Triangle(gl)
        if (geometry.attributes.uv) {
            delete geometry.attributes.uv
        }

        const defaultColors: [number, number, number][] = [
            [1.0, 0.15, 0.22],
            [0.49, 1.0, 0.4],
            [0.32, 0.15, 1.0],
        ]

        const colorStopsArray = (colorStops || []).map(
            (color: any, index: number) => {
                const fb = defaultColors[index] || defaultColors[0];
                return parseColor(color, fb)
            }
        )

        program = new Program(gl, {
            vertex: VERT,
            fragment: FRAG,
            uniforms: {
                uTime: { value: 0 },
                uAmplitude: { value: amplitude },
                uColorStops: { value: colorStopsArray.flat() },
                uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
                uBlend: { value: blend },
            },
        })

        mesh = new Mesh(gl, { geometry, program })
        ctn.appendChild(gl.canvas)

        function resize() {
            if (!ctn) return
            const width = ctn.offsetWidth
            const height = ctn.offsetHeight

            renderer.setSize(width, height)

            if (program) {
                program.uniforms.uResolution.value = [width, height]

                const baseHeight = 800.0
                const currentHeight = height || 1.0
                const scaleFactor = baseHeight / currentHeight
                const baseAmp = propsRef.current.amplitude ?? amplitude
                program.uniforms.uAmplitude.value = baseAmp * scaleFactor
            }
            
            renderer.render({ scene: mesh })
        }

        window.addEventListener("resize", resize)
        resize()

        let animationFrameId: number
        let lastTime = performance.now()
        let totalElapsed = 0

        function update(now: number) {
            const delta = now - lastTime
            lastTime = now
            
            // Note: Since you cut off right at the beginning of update loop, 
            // make sure your original requestAnimationFrame logic continues here...
            totalElapsed += (delta * 0.001) * (propsRef.current.speed ?? speed)
            if (program) {
                program.uniforms.uTime.value = totalElapsed
            }
            renderer.render({ scene: mesh })
            animationFrameId = requestAnimationFrame(update)
        }
        animationFrameId = requestAnimationFrame(update)

        return () => {
            window.removeEventListener("resize", resize)
            cancelAnimationFrame(animationFrameId)
            gl.getExtension('WEBGL_lose_context')?.loseContext()
            gl.canvas.remove()
        }
    }, [amplitude, blend, colorStops, height, speed])

    return <div ref={ctnDom} style={{ width: "100%", height }} />
}

// 2. Export via React.memo with custom prop comparison function
export default memo(FloatingAnimation, (prevProps, nextProps) => {
  const matchPrimitives =
    prevProps.amplitude === nextProps.amplitude &&
    prevProps.blend === nextProps.blend &&
    prevProps.speed === nextProps.speed &&
    prevProps.height === nextProps.height;

  const prevColors = prevProps.colorStops || [];
  const nextColors = nextProps.colorStops || [];
  const matchColors =
    prevColors.length === nextColors.length &&
    prevColors.every((color, index) => color === nextColors[index]);

  return matchPrimitives && matchColors;
});