import Camera from "./components/Camera"
import { Suspense, useEffect, useLayoutEffect, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { VSMShadowMap } from "three"
import Config from "./Config"
import { clamp, Only } from "./utils/utils"
import { setState, State, useStore } from "./data/store"
import World from "./components/World"
import Controller from "./components/Controller"
import Stage from "./components/Stage"
import { Perf } from "r3f-perf"
import { CannonProvider } from "./utils/cannon"
import FontFaceObserver from "fontfaceobserver"
import Lights from "./components/Lights"

document.addEventListener("contextmenu", event => {
    event.preventDefault()
})

export default function Wrapper() {
    return (
        <Canvas
            gl={{
                antialias: true,
                depth: true,
                stencil: false,
                alpha: true,
                powerPreference: "high-performance"
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
            frameloop="always"
            shadows={{
                type: VSMShadowMap,
            }} 
            camera={{
                zoom: 30,
                near: 0.01,
                far: 75
            }} 
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
    let id = useStore(i => i.id)
    let [fontsReady, setFontsReady] = useState(false)
 
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
            <Lights />
            <Camera />

            <CannonProvider debug={Config.DEBUG}>
                <Controller>
                </Controller>
                <World />
                <Stage key={id} />
            </CannonProvider>
        </>
    )
} 