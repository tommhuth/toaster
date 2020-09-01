import "../assets/styles/app.scss"

import React from "react"
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
import WorldBlock from "./components/WorldBlock"

/*
softShadows({
    frustrum: 3.75, // Frustrum width (default: 3.75)
    size: 0.005, // World size (default: 0.005)
    near: 9.5, // Near plane (default: 9.5)
    samples: 17, // Samples (default: 17)
    rings: 11, // Rings (default: 11)
})
*/

const maps = [
    {
        name: "Up against the wall",
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
        ]
    }, {
        name: "Everyone",
        launcherPosition: [10, .1, 10],
        world: [
        ],
        elements: [
            {
                type: "shelf",
                x: 5,
                z: 0,
                rotated: true
            },
            {
                type: "shelf",
                x: -5,
                z: 0,
                rotated: false
            },
            {
                type: "short-shelf",
                x: 5,
                z: 10,
                rotated: false
            },
            {
                type: "bowl",
                x: 10,
                z: 10,
                rotated: false
            },
            {
                type: "short-shelf",
                x: -2,
                z: -10,
                rotated: false
            },
        ]
    },
    {
        name: "The Arrow",
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
                z: 0,
                rotated: true
            },
            {
                type: "bowl",
                z: -5,
                x: -3
            },
        ]
    }
]

function Ui() {
    let objects = useStore(i => i.data.objects)
    let map = useStore(i => i.data.map)
    let state = useStore(i => i.data.state)
    let actions = useStore(i => i.actions)

    return (
        <div className="ui">
            <p>objs: {objects}</p>
            <p>state: {state}</p>
            <p>
                map:{" "}
                <select
                    value={maps.findIndex(i => i.name === map?.name) || -1}
                    onChange={(e) => actions.useMap(maps[e.target.value])}
                >
                    <option value="-1" disabled>Pick map</option>
                    {maps.map((i, index) => <option key={i.name} value={index}>{i.name}</option>)}
                </select>
            </p>
        </div>
    )
}

function hasWebgl2() { 
    try {  
        var canvas = document.createElement( 'canvas' );
        return !! ( window.WebGL2RenderingContext && canvas.getContext( 'webgl2' ) );
    } catch ( e ) { 
        return false; 
    } 
}


function Game() {
    let map = useStore(i => i.data.map)

    return (
        <>
            <Ui />
            <Canvas
                noEvents
                colorManagement
                gl2={hasWebgl2()}
                shadowMap={true}
                orthographic
                pixelRatio={1.25}
                gl={{
                    stencil: false,
                    depth: false,
                    alpha: false,
                    antialias: false,
                    
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
                    {map ? <Stage {...map} key={map.name} /> : null}

                    <WorldBlock isFloor y={-2} width={100} height={4} depth={100} z={0} />
                </CannonProvider>
            </Canvas>
        </>
    )
}

ReactDOM.render(<Game />, document.getElementById("root"))