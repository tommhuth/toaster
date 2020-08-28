import "../assets/styles/app.scss"

import React, { useRef } from "react"
import ReactDOM from "react-dom"
import { Canvas } from "react-three-fiber"
import { useStore } from "./store"
import { softShadows } from "drei"
import { Suspense } from "react"
import Lights from "./comps/Lights"
import Post from "./comps/Post"

import { CannonProvider } from "./utils/cannon"
import Camera from "./comps/Camera"
import Floor from "./comps/Floor"
import Launcher from "./comps/Launcher"
import Chair from "./comps/Chair"
import Shelf from "./comps/Shelf"
import Shelf2 from "./comps/Shelf2"
import Bowl from "./comps/Bowl"
import Stage from "./comps/Stage"

softShadows({
    frustrum: 3.75, // Frustrum width (default: 3.75)
    size: 0.005, // World size (default: 0.005)
    near: 9.5, // Near plane (default: 9.5)
    samples: 17, // Samples (default: 17)
    rings: 11, // Rings (default: 11)
})


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
                <Stage>
                    <Floor y={-2} width={100} height={4} depth={100} z={0} />

                    <Shelf x={-8} />
                    <Chair z={-7} />
                    <Bowl z={-5} x={-3} />
                    <Shelf2 x={0} />
                </Stage>
            </CannonProvider>
        </Canvas>
    </>,
    document.getElementById("root")
)
