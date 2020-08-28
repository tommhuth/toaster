import "../assets/styles/app.scss"

import React, { useRef } from "react"
import ReactDOM from "react-dom"
import { Canvas } from "react-three-fiber" 
import Game from "./comps/Game"
import { useStore } from "./store"
import { softShadows } from "drei"
import { Suspense, useMemo, useEffect } from "react" 
import Lights from "./comps/Lights" 
import Post from "./comps/Post" 

softShadows({
    frustrum: 3.75, // Frustrum width (default: 3.75)
    size: 0.005, // World size (default: 0.005)
    near: 14.5, // Near plane (default: 9.5)
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
                fov: 75,
                near: -10,
                far: 50,
            }}
        >
            <Suspense fallback={null}>
                <Post />
            </Suspense>
            
            <Lights />
            <Game />
        </Canvas>
    </>,
    document.getElementById("root")
)
