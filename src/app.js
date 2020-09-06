import "../assets/styles/app.scss"

import React, { useRef, useEffect } from "react"
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
    let ref = useRef()
    let objects = useStore(i => i.data.objects)
    let score = useStore(i => i.data.score)
    let map = useStore(i => i.data.map)
    let state = useStore(i => i.data.state)
    let launcher = useStore(i => i.data.launcher)
    let actions = useStore(i => i.actions)
    let cursorSize = 16

    useEffect(() => {
        let onMouseMove = e => {
            ref.current.style.display = "block"
            ref.current.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`
        }
        let onMouseEnter = () => {
            ref.current.style.display = "block"
        }
        let onMouseLeave = () => {
            ref.current.style.display = "none"
        }
        let activators = ["BUTTON", "A"]

        window.addEventListener("mousemove", onMouseMove)
        document.body.addEventListener("mouseleave", onMouseLeave)
        document.body.addEventListener("mouseenter", onMouseEnter)

        document.body.addEventListener("mouseenter", e => {
            if (activators.includes(e.target.tagName) || e.target.classList.contains(".actionable")) {
                ref.current.style.width = cursorSize * 2.5 + "px"
                ref.current.style.height = cursorSize * 2.5 + "px"

            }
        }, { capture: true })

        document.body.addEventListener("mouseleave", e => {
            if (activators.includes(e.target.tagName) || e.target.classList.contains(".actionable")) {
                ref.current.style.width = ""
                ref.current.style.height = ""
            }
        }, { capture: true })

        return () => {
            window.removeEventListener("mousemove", onMouseMove)
            document.body.removeEventListener("mouseleave", onMouseLeave)
            document.body.removeEventListener("mouseenter", onMouseEnter)
        }
    }, [])

    return (
        <>
            <div
                ref={ref}
                className="pointer"
                style={{
                    position: "fixed",
                    display: "none",
                    transition: "width .3s, height .3s",
                    zIndex: 10000000,
                    pointerEvents: "none",
                    backgroundColor: "yellow",
                    mixBlendMode: "difference",
                    top: 0,
                    left: 0,
                    borderRadius: "50%"
                }}
            />
            <div className="ui">
                <p>objs: {objects - score}</p>
                <p>state: {state}</p>
                <p>MAP</p>
                <ul>
                    {maps.map((i) => <li key={i.name} onClick={()=> actions.useMap(i)}><button>{i.name}</button></li>)}
                </ul>
            </div>
            <svg viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}>
                <line
                    style={{ display: launcher.active ? "block" : "none" }}
                    x1={launcher.start[0]}
                    x2={launcher.end[0]}
                    y1={launcher.start[1]}
                    y2={launcher.end[1]}
                    strokeWidth="3"
                    stroke="white"
                />
            </svg>
        </>
    )
}


function Game() {
    let map = useStore(i => i.data.map)
    let attempts = useStore(i => i.data.attempts)

    return (
        <>
            <Ui />
            <Canvas
                noEvents
                colorManagement
                shadowMap
                orthographic
                pixelRatio={1.25}
                gl={{
                    stencil: false,
                    depth: true,
                    alpha: false,
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

                    <WorldBlock isFloor y={-2} width={100} height={4} depth={100} z={0} />
                </CannonProvider>
            </Canvas>
        </>
    )
}

ReactDOM.render(<Game />, document.getElementById("root"))

/*

                <Suspense fallback={null}>
                    <Post />
                </Suspense>
                */