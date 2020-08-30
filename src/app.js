import "../assets/styles/app.scss"

import React, { useRef } from "react"
import ReactDOM from "react-dom"
import { Canvas } from "react-three-fiber"
import { useStore } from "./utils/store"
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
        launcherPosition: [14, .1, 14],
        world: [
            {
                height: 10,
                width: 7,
                depth: 7,
                x: -0,
                y: 5,
                z: -0
            }
        ],
        elements: [
            {
                type: "shelf",
                x: 0,
                z: 5,
            },
            {
                type: "chair",
                z: 0,
                x: 5.25,
                rotation: 1.4
            },
            /*
            {
                type: "bowl",
                z: -5,
                x: -3
            },
            {
                type: "short-shelf",
                x: 0
            }
            */
        ]
    },
    { 
        name: "The 2",
        launcherPosition: [0, .1, 14],
        world: [ 
            {
                height: 4,
                width: 1,
                depth: 8,
                x: 4,
                y: 2,
                z: 0
            }
        ],
        elements: [
            {
                type: "shelf",
                x: -6,
                z: 0,
            },  
            {
                type: "shelf",
                x: 0,
                z: 0,
            },  
            {
                type: "short-shelf",
                x: 5.75,
                z: 0
            }
            /*
            {
                type: "bowl",
                z: -5,
                x: -3
            },
            {
                type: "short-shelf",
                x: 0
            }
            */
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
2
let id = new URLSearchParams(location.search).get("id") || 0

ReactDOM.render(
    <>
        <Ui />
        <Canvas
            noEvents
            colorManagement
            shadowMap={true}
            orthographic
            pixelRatio={1.25}
            gl={{
                stencil: false,
                depth: false,
                alpha: false,
                antialias: false
            }}
            camera={{
                zoom: 45,
                fov: 60,
                near: 0,
                far: 50,
            }}
        >
            <Suspense fallback={null}>
                <Post />
            </Suspense>

            <Lights />
            <Camera />

            <CannonProvider>
                <Stage {...maps[id]} key={maps[id].name} />
            </CannonProvider>
        </Canvas>
    </>,
    document.getElementById("root")
)