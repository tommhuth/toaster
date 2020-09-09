import "../assets/styles/app.scss"

import React, { useRef, useEffect, useState } from "react"
import ReactDOM from "react-dom"
import { Canvas } from "react-three-fiber"
import { useStore, api } from "./utils/store"
import { useAnimationFrame } from "./utils/hooks"
import { Suspense } from "react"
import Lights from "./components/Lights"
import Post from "./components/Post"
import { CannonProvider } from "./utils/cannon"
import Camera from "./components/Camera"
import Stage from "./components/Stage"
import Only from "./components/Only"
import WorldBlock from "./components/world/WorldBlock"
import State from "./utils/const/State"
import maps from "./utils/maps"
import { Vector3 } from "three"


function MapSelect() {
    let scroller = useRef()
    let y = useRef(0)
    let targetY = useRef(0)
    let [active, setActive] = useState(0)
    let scrolling = useRef(true) 
    let actions = useStore(i => i.actions)
    let map = useStore(i => i.data.map)

    useAnimationFrame(() => {
        scroller.current.style.transform = `translateY(${y.current}px)`
        scrolling.current = Math.abs(targetY.current - y.current) > 10

        if (Math.abs(targetY.current - y.current) < 1) {
            y.current = targetY.current
        } else {
            y.current += (targetY.current - y.current) * .04
        }
    })

    useEffect(() => {
        if (active - 1 >= 0 && map !== maps[active - 1]) {
            actions.loadMap(maps[active - 1])
        }
    }, [active])

    useEffect(() => {
        targetY.current = -active * window.innerHeight
    }, [active])

    useEffect(() => {
        let id
        let started = false
        let onWheel = e => {
            e.preventDefault()

            if (!started) {
                started = true

                setActive(prev => {
                    let next = prev

                    if (e.deltaY > 0) {
                        next += next < maps.length ? 1 : 0
                    } else {
                        next -= next > 0 ? 1 : 0
                    }

                    return next
                })
            }

            clearTimeout(id)
            id = setTimeout(() => started = false, 50)
        }

        window.addEventListener("wheel", onWheel, { passive: false })

        return () => window.removeEventListener("wheel", onWheel)
    }, [])

    return (
        <>
            <div
                ref={scroller}
                className="page"
                id="page"
            >
                <div className="block">
                    <h1 className="h2">Ball <br />versus <br />furniture</h1>
                </div>
                {maps.map((i, index) => {
                    return (
                        <div
                            key={index}
                            className="block"
                            onClick={() => actions.play()}
                        >
                            <p className="h3">Level {index + 1}</p>
                            <h2 className="h2">{i.name}</h2>
                        </div>
                    )
                })}
            </div>
            <ul className={"dots " + (active >= 1 ? "a" : "")}>
                {new Array(maps.length).fill().map((i, index) => (
                    <li
                        onClick={(e) => {
                            e.stopPropagation()
                            setActive(index + 1)
                        }}
                        className={index === active - 1 ? "a" : ""}
                        key={index}
                    >
                        {index}
                    </li>
                ))}
            </ul>
        </>
    )
}

function Cursor() { 
    let pointer = useRef()
    let line = useRef()
    let actions = useStore(i => i.actions)
    let cursorSize = 16

    useEffect(() => {
        setTimeout(() => actions.loadMap(maps[1]), 500)
    }, [])

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

function Ui() { 
    let state = useStore(i => i.data.state) 
    let attempts = useStore(i => i.data.attempts) 

    console.log(attempts, state)

    return (
        <>
            <Only if={[State.INTRO, State.READY, State.PREPARING].includes(state)}>
                <MapSelect />
            </Only> 
            <Only if={state === State.GAME_OVER}>
                <h1 className="h1">
                    Game over
                </h1>
            </Only>

            <Cursor />
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
                    position: new Vector3(10,10,10),
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