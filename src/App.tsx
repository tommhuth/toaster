
import Camera from "./components/Camera"
import { EffectComposer, Noise } from "@react-three/postprocessing"
import { Suspense, useEffect, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { DirectionalLight } from "three"
import { CannonProvider } from "./utils/cannon"
import { VSMShadowMap } from "three"
import Controller from "./components/Controller"
import Config from "./Config"
import { Only } from "./utils/utils"
import Stage from "./components/Stage"

export default function Wrapper() {
    return (
        <Canvas
            gl={{
                antialias: false,
                depth: true,
                stencil: false,
                alpha: true
            }}
            style={{
                width: "100%",
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                height: "100%",
                position: "fixed",
            }}
            orthographic
            frameloop="demand"
            shadows={{
                type: VSMShadowMap,
            }}
            camera={{ zoom: 65, near: -40, far: 60 }}
            dpr={[1, window.devicePixelRatio * .75]}
        >
            <App />
            <Only if={Config.DEBUG}>
                <axesHelper scale={5} position={[0, 1, 0]} />
            </Only>
        </Canvas>
    )
}

function App() {
    let { scene, viewport, gl } = useThree()
    let ref = useRef<DirectionalLight>(null)

    useEffect(() => {
        if (ref.current) {
            scene.add(ref.current.target)
        }
    }, [])

    useEffect(() => {
        if (ref.current) {
            let light = ref.current

            // left - right
            light.shadow.camera.near = -viewport.width
            light.shadow.camera.far = viewport.width

            // top - bottom
            light.shadow.camera.left = -viewport.height
            light.shadow.camera.right = viewport.height

            // bottom left - top right diag
            light.shadow.camera.top = 25
            light.shadow.camera.bottom = -25

            light.shadow.camera.updateProjectionMatrix()
        }
    }, [viewport])

    useFrame(() => {
        gl.info.autoReset = false
        gl.info.reset()
    })

    return (
        <>
            <directionalLight
                color={"#c9dbff"}
                position={[0, 0, 0]}
                target-position={[-25, -18, -24]}
                intensity={.6}
                castShadow
                matrixAutoUpdate={false}
                ref={ref}
                shadow-radius={2.25}
                shadow-mapSize={[512, 512]}
                shadow-bias={-0.003}
            />
            <directionalLight
                color={"#97ffff"}
                position={[-10, 1, -10]}
                intensity={.05}
            />
            <ambientLight intensity={.2} color="#0066ff" />

            <Suspense fallback={null}>
                <Camera />

                <CannonProvider debug={Config.DEBUG}>
                    <Stage />
                    <Controller />
                </CannonProvider>

                <EffectComposer>
                </EffectComposer>
            </Suspense>
        </>
    )
}