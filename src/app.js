import "../assets/styles/app.scss"

import React from "react"
import ReactDOM from "react-dom"
import { Canvas } from "react-three-fiber"
import { useStore } from "./utils/store"
import { Suspense } from "react"
import Lights from "./components/Lights"
import Post from "./components/Post"
import { CannonProvider } from "./utils/cannon"
import Camera from "./components/Camera"
import Stage from "./components/Stage"
import WorldBlock from "./components/world/WorldBlock"
import FontLoader from "./components/FontLoader"
import Ui from "./ui/Ui"

function Game() {
    let map = useStore(i => i.data.map)
    let attempts = useStore(i => i.data.attempts)

    return (
        <FontLoader>
            <Ui />
            <Canvas
                noEvents
                colorManagement
                shadowMap
                orthographic
                pixelRatio={1.5}
                gl={{
                    stencil: false,
                    depth: false,
                    alpha: true,
                    antialias: false,

                }}
                camera={{
                    zoom: 45,
                    fov: 60,
                    near: -20,
                    far: 50,
                }}
            >
                <Lights />
                <Camera />

                <Suspense fallback={null}>
                    <Post />
                </Suspense>

                <CannonProvider>
                    {map ? <Stage {...map} key={attempts} /> : null}

                    <WorldBlock isFloor y={-2} width={200} height={4} depth={200} z={0} />
                </CannonProvider>
            </Canvas>
        </FontLoader>
    )
}

ReactDOM.render(<Game />, document.getElementById("root"))