import "../assets/styles/app.scss"

import React, { useRef } from "react"
import ReactDOM from "react-dom"
import { Canvas } from "react-three-fiber"
import { useStore } from "./store"
import { softShadows } from "drei"
import { Suspense } from "react"
import Lights from "./components/Lights"
import Post from "./components/Post" 
import { CannonProvider } from "./utils/cannon"
import Camera from "./components/Camera" 
import Stage from "./components/Stage"

softShadows({
    frustrum: 3.75, // Frustrum width (default: 3.75)
    size: 0.005, // World size (default: 0.005)
    near: 9.5, // Near plane (default: 9.5)
    samples: 17, // Samples (default: 17)
    rings: 11, // Rings (default: 11)
})


const maps = [
    { 
        name: "The Ivar",
        launcherPosition: [10, 1, 10],
        world: [
            {
                height: 10,
                width: 5,
                depth: 5,
                x: -5,
                y: 5,
                z: -5
            }
        ],
        elements: [
            {
                type: "shelf",
                x: -8
            },
            {
                type: "chair",
                z: -7,
                rotation: 2
            },
            {
                type: "bowl",
                z: -5,
                x: -3
            },
            {
                type: "short-shelf",
                x: 0
            }
        ]
    }
]

function Ui() {
    let objects = useStore(i => i.data.objects)
    let state = useStore(i => i.data.state)

    return (
        <div className="ui">
            <p>objs: {objects}</p>
            <p>state: {state}</p>
        </div>
    )
}

ReactDOM.render(
    <>
        <Ui />
        <Canvas
            noEvents
            colorManagement
            shadowMap={true}
            orthographic
            pixelRatio={1}
            gl={{
                stencil: false,
                depth: false,
                alpha: false,
                antialias: false
            }}
            camera={{
                zoom: 45,
                fov: 60,
                near: -10,
                far: 50,
            }}
        >
            <Suspense fallback={null}>
                <Post />
            </Suspense>

            <Lights />
            <Camera />

            <CannonProvider>
                <Stage {...maps[0]} key={maps[0].name} />
            </CannonProvider>
        </Canvas>
    </>,
    document.getElementById("root")
)