import Camera from "./components/Camera"
import { Suspense, useEffect, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { DirectionalLight } from "three"
import { VSMShadowMap } from "three"
import Config from "./Config"
import { Only } from "./utils/utils"
import { setState, State, useStore } from "./data/store"
import World from "./components/World"
import Controller from "./components/Controller"
import Stage from "./components/Stage"
import { CannonProvider } from "./utils/cannon"
import FontFaceObserver from "fontfaceobserver"

export default function Wrapper() {
    return (
        <Canvas
            gl={{
                antialias: true,
                depth: true,
                stencil: false,
                alpha: true
            }}
            style={{
                width: "100%",
                left: 0,
                top: 0,
                height: "100%",
                zIndex: 1,
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
            <Suspense fallback={null}>
                <App />
            </Suspense>
            <Only if={Config.DEBUG}>
                <axesHelper scale={5} position={[0, 1, 0]} />
            </Only>
        </Canvas>
    )
}

function App() {
    let { scene, viewport, gl } = useThree()
    let ref = useRef<DirectionalLight>(null)
    let id = useStore(i => i.id)
    let [fontsReady, setFontsReady] = useState(false)

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

    useEffect(() => {
        let serif = new FontFaceObserver("Cormorant Garamond", {
            weight: 300,
            style: "italic"
        })
        let sans = new FontFaceObserver("Roboto", {
            weight: 900,
            style: "normal"
        })

        Promise.all([serif.load(), sans.load()])
            .catch(() => { })
            .finally(() => setFontsReady(true))
    }, [])

    useEffect(() => {
        if (fontsReady) {
            setState(State.INTRO)

            setTimeout(() => {
                document.body.style.backgroundImage = "linear-gradient(to bottom, rgb(199, 159, 0), rgb(255, 123, 0))"
                document.body.style.backgroundColor = "rgb(255, 123, 0)"
                document.querySelector(".loader")?.remove()
            }, 250)
        }
    }, [fontsReady])


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
                position={[-15, 1, -10]}
                intensity={.05}
            />
            <ambientLight intensity={.2} color="#0066ff" />

            <Camera />

            <CannonProvider debug={Config.DEBUG}>
                <World />
                <Stage key={id} />
                <Controller />
            </CannonProvider>

        </>
    )
}

function rgb(arg0: number, arg1: number, arg2: number) {
    throw new Error("Function not implemented.")
}
