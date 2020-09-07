import "../assets/styles/app.scss"

import React, { useRef, useEffect } from "react"
import ReactDOM from "react-dom"
import { Canvas } from "react-three-fiber"
import { useStore, api } from "./utils/store"
import { Suspense } from "react"
import Lights from "./components/Lights"
import Post from "./components/Post"
import { CannonProvider } from "./utils/cannon"
import Camera from "./components/Camera"
import Stage from "./components/Stage"
import WorldBlock from "./components/world/WorldBlock"
import State from "./utils/const/State"
import maps from "./utils/maps"

function Only(props) {
    return props.if ? <>{props.children}</> : null
}

function Ui() {
    let pointer = useRef()
    let line = useRef()
    let tid = useRef()
    let scroller = useRef()
    let map = useStore(i => i.data.map)
    let state = useStore(i => i.data.state)
    let actions = useStore(i => i.actions)
    let cursorSize = 16

    useEffect(() => {
        return api.subscribe(launcher => {
            if (launcher.active) {
                line.current.style.display = "block"
                line.current.setAttribute("x1", launcher.start[0])
                line.current.setAttribute("y1", launcher.start[1])
                line.current.setAttribute("x2", launcher.end[0])
                line.current.setAttribute("y2", launcher.end[1])
            } else {
                line.current.style.display = "none"
            }
        }, state => state.data.launcher)
    }, [])

    useEffect(() => {
        let onMouseMove = e => {
            pointer.current.style.display = "block"
            pointer.current.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`
        }
        let onMouseEnter = () => {
            pointer.current.style.display = "block"
        }
        let onMouseLeave = () => {
            pointer.current.style.display = "none"
        }
        let onMouseEnterCapture = e => {
            if (activators.includes(e.target.tagName) || e.target.classList.contains(".actionable")) {
                pointer.current.style.width = cursorSize * 2.5 + "px"
                pointer.current.style.height = cursorSize * 2.5 + "px"

            }
        }
        let onMouseLeaveCapture = e => {
            if (activators.includes(e.target.tagName) || e.target.classList.contains(".actionable")) {
                pointer.current.style.width = ""
                pointer.current.style.height = ""
            }
        }
        let activators = ["BUTTON", "A"]

        window.addEventListener("mousemove", onMouseMove)
        document.body.addEventListener("mouseleave", onMouseLeave)
        document.body.addEventListener("mouseenter", onMouseEnter)
        document.body.addEventListener("mouseenter", onMouseEnterCapture, { capture: true })
        document.body.addEventListener("mouseleave", onMouseLeaveCapture, { capture: true })

        return () => {
            window.removeEventListener("mousemove", onMouseMove)
            document.body.removeEventListener("mouseenter", onMouseEnter)
            document.body.removeEventListener("mouseleave", onMouseLeave)
            document.body.removeEventListener("mouseenter", onMouseEnterCapture)
            document.body.removeEventListener("mouseleave", onMouseLeaveCapture)
        }
    }, [])

    console.log(state)

    return (
        <>
            <div
                ref={pointer}
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
            <Only if={[State.INTRO, State.READY, State.PREPARING].includes(state)}>
                <div
                    ref={scroller}
                    className="page"
                    onScroll={() => {
                        clearTimeout(tid.current)

                        tid.current = setTimeout(() => {
                            let index = Math.floor(scroller.current.scrollTop / window.innerHeight) - 1

                            if (index >= 0 && (!map || maps[index].name !== map.name)) {
                                console.log("use", index)
                                actions.loadMap(maps[index])
                            }
                        }, 50)
                    }}
                >
                    <div className="block">
                        <h1>Ball versus furniture</h1>
                    </div>
                    {maps.map((i, index) => {
                        return (
                            <div
                                key={index}
                                className="block"
                                onClick={() => {
                                    actions.play()
                                }}
                            >
                                <p>Level {index + 1}</p>
                                <h2>{i.name}</h2>
                            </div>
                        )
                    })}
                </div>
            </Only>

            <svg viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}>
                <line
                    strokeWidth="3"
                    stroke="white"
                    ref={line}
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
